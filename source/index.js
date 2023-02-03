export default class VueBodyClass {
  constructor(routes) {
    this.routes = routes
  }

  guard(to, from, next) {
    try {
      let parent = this.routes
      const toMatched = this.parseMatched(to.matched)
      let additionalClassName = ''
      let classesToRemove = ''

      //is a home page?
      if (to.path == '/') {
        additionalClassName = this.updateClassFromRoute(additionalClassName, to)
      }
      //not homepage
      else if (toMatched.length > 0) {
        for (const index in toMatched) {
          const routes = parent.children ? parent.children : parent
          const found = this.findMatchInRoutesByPath(routes, toMatched[index])

          if (found) {
            parent = found
            additionalClassName = this.updateClassFromRoute(
              additionalClassName,
              found
            )
          }
        }
      }

      const fromMatched = this.parseMatched(from.matched)
      if (fromMatched.length > 0) {
        parent = this.routes
        for (const index in fromMatched) {
          const routes = parent.children ? parent.children : parent
          const found = this.findMatchInRoutesByPath(routes, fromMatched[index])

          if (found) {
            parent = found
            classesToRemove += this.getClassForRoute(found) || ''
          }
        }

        if (classesToRemove) {
          const classArray = classesToRemove.split()
          classArray.forEach((individialClass) => {
            individialClass = individialClass.trim()

            if (individialClass) {
              document.body.className = document.body.className
                .split(individialClass)
                .join('')
            }
          })
        }
      }

      document.body.className = (
        document.body.className + additionalClassName
      ).trim()
    } catch {}

    next()
  }

  parseMatched(matchedArray) {
    const matched = []

    for (const index in matchedArray) {
      const prev = matched.join('/')

      matched.push(
        matchedArray[index].path
          .replace(/^\/|\/$/g, '')
          .replace(prev, '')
          .replace(/^\/|\/$/g, '')
      )
    }

    return matched
  }

  findMatchInRoutesByPath(routes, matchedItem) {
    return routes.find((o) => {
      return o.path.replace(/^\/|\/$/g, '') == matchedItem
    })
  }

  getClassForRoute(route) {
    return route.meta ? route.meta.bodyClass : null
  }

  updateClassFromRoute(className, route) {
    const routeClass = this.getClassForRoute(route)

    if (routeClass) {
      const routeBodyClass = routeClass.replace(/^!/, '')

      if (routeClass.indexOf('!') === 0) {
        className = ' ' + routeBodyClass
      } else {
        className += ' ' + routeBodyClass
      }
    }

    return className
  }
}
