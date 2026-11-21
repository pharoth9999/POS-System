/**
 * Typed route meta. There is no auth right now, so no roles or public flags:
 * every page is open (see docs/decisions.md).
 */
declare module 'vue-router' {
  interface RouteMeta {
    /** i18n key for the page title and the browser tab. */
    title?: string
  }
}

export {}
