/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as RedirectImport } from './routes/redirect'
import { Route as DeferredImport } from './routes/deferred'
import { Route as PathlessLayoutImport } from './routes/_pathlessLayout'
import { Route as PostIdImport } from './routes/$postId'
import { Route as CoursesRouteImport } from './routes/courses/route'
import { Route as IndexImport } from './routes/index'
import { Route as CoursesIndexImport } from './routes/courses/index'
import { Route as GameOrderingGameImport } from './routes/game/ordering-game'
import { Route as GameOrderGameImport } from './routes/game/order-game'
import { Route as GameLinkGameImport } from './routes/game/link-game'
import { Route as GameBubbleGameImport } from './routes/game/bubble-game'
import { Route as GameBlindBoxGameImport } from './routes/game/blind-box-game'
import { Route as CoursesPostIdImport } from './routes/courses/$postId'
import { Route as PathlessLayoutNestedLayoutImport } from './routes/_pathlessLayout/_nested-layout'
import { Route as CoursesPostIdDeepImport } from './routes/courses_.$postId.deep'
import { Route as PathlessLayoutNestedLayoutRouteBImport } from './routes/_pathlessLayout/_nested-layout/route-b'
import { Route as PathlessLayoutNestedLayoutRouteAImport } from './routes/_pathlessLayout/_nested-layout/route-a'

// Create/Update Routes

const RedirectRoute = RedirectImport.update({
  id: '/redirect',
  path: '/redirect',
  getParentRoute: () => rootRoute,
} as any)

const DeferredRoute = DeferredImport.update({
  id: '/deferred',
  path: '/deferred',
  getParentRoute: () => rootRoute,
} as any)

const PathlessLayoutRoute = PathlessLayoutImport.update({
  id: '/_pathlessLayout',
  getParentRoute: () => rootRoute,
} as any)

const PostIdRoute = PostIdImport.update({
  id: '/$postId',
  path: '/$postId',
  getParentRoute: () => rootRoute,
} as any)

const CoursesRouteRoute = CoursesRouteImport.update({
  id: '/courses',
  path: '/courses',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const CoursesIndexRoute = CoursesIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => CoursesRouteRoute,
} as any)

const GameOrderingGameRoute = GameOrderingGameImport.update({
  id: '/game/ordering-game',
  path: '/game/ordering-game',
  getParentRoute: () => rootRoute,
} as any)

const GameOrderGameRoute = GameOrderGameImport.update({
  id: '/game/order-game',
  path: '/game/order-game',
  getParentRoute: () => rootRoute,
} as any)

const GameLinkGameRoute = GameLinkGameImport.update({
  id: '/game/link-game',
  path: '/game/link-game',
  getParentRoute: () => rootRoute,
} as any)

const GameBubbleGameRoute = GameBubbleGameImport.update({
  id: '/game/bubble-game',
  path: '/game/bubble-game',
  getParentRoute: () => rootRoute,
} as any)

const GameBlindBoxGameRoute = GameBlindBoxGameImport.update({
  id: '/game/blind-box-game',
  path: '/game/blind-box-game',
  getParentRoute: () => rootRoute,
} as any)

const CoursesPostIdRoute = CoursesPostIdImport.update({
  id: '/$postId',
  path: '/$postId',
  getParentRoute: () => CoursesRouteRoute,
} as any)

const PathlessLayoutNestedLayoutRoute = PathlessLayoutNestedLayoutImport.update(
  {
    id: '/_nested-layout',
    getParentRoute: () => PathlessLayoutRoute,
  } as any,
)

const CoursesPostIdDeepRoute = CoursesPostIdDeepImport.update({
  id: '/courses_/$postId/deep',
  path: '/courses/$postId/deep',
  getParentRoute: () => rootRoute,
} as any)

const PathlessLayoutNestedLayoutRouteBRoute =
  PathlessLayoutNestedLayoutRouteBImport.update({
    id: '/route-b',
    path: '/route-b',
    getParentRoute: () => PathlessLayoutNestedLayoutRoute,
  } as any)

const PathlessLayoutNestedLayoutRouteARoute =
  PathlessLayoutNestedLayoutRouteAImport.update({
    id: '/route-a',
    path: '/route-a',
    getParentRoute: () => PathlessLayoutNestedLayoutRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/courses': {
      id: '/courses'
      path: '/courses'
      fullPath: '/courses'
      preLoaderRoute: typeof CoursesRouteImport
      parentRoute: typeof rootRoute
    }
    '/$postId': {
      id: '/$postId'
      path: '/$postId'
      fullPath: '/$postId'
      preLoaderRoute: typeof PostIdImport
      parentRoute: typeof rootRoute
    }
    '/_pathlessLayout': {
      id: '/_pathlessLayout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof PathlessLayoutImport
      parentRoute: typeof rootRoute
    }
    '/deferred': {
      id: '/deferred'
      path: '/deferred'
      fullPath: '/deferred'
      preLoaderRoute: typeof DeferredImport
      parentRoute: typeof rootRoute
    }
    '/redirect': {
      id: '/redirect'
      path: '/redirect'
      fullPath: '/redirect'
      preLoaderRoute: typeof RedirectImport
      parentRoute: typeof rootRoute
    }
    '/_pathlessLayout/_nested-layout': {
      id: '/_pathlessLayout/_nested-layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof PathlessLayoutNestedLayoutImport
      parentRoute: typeof PathlessLayoutImport
    }
    '/courses/$postId': {
      id: '/courses/$postId'
      path: '/$postId'
      fullPath: '/courses/$postId'
      preLoaderRoute: typeof CoursesPostIdImport
      parentRoute: typeof CoursesRouteImport
    }
    '/game/blind-box-game': {
      id: '/game/blind-box-game'
      path: '/game/blind-box-game'
      fullPath: '/game/blind-box-game'
      preLoaderRoute: typeof GameBlindBoxGameImport
      parentRoute: typeof rootRoute
    }
    '/game/bubble-game': {
      id: '/game/bubble-game'
      path: '/game/bubble-game'
      fullPath: '/game/bubble-game'
      preLoaderRoute: typeof GameBubbleGameImport
      parentRoute: typeof rootRoute
    }
    '/game/link-game': {
      id: '/game/link-game'
      path: '/game/link-game'
      fullPath: '/game/link-game'
      preLoaderRoute: typeof GameLinkGameImport
      parentRoute: typeof rootRoute
    }
    '/game/order-game': {
      id: '/game/order-game'
      path: '/game/order-game'
      fullPath: '/game/order-game'
      preLoaderRoute: typeof GameOrderGameImport
      parentRoute: typeof rootRoute
    }
    '/game/ordering-game': {
      id: '/game/ordering-game'
      path: '/game/ordering-game'
      fullPath: '/game/ordering-game'
      preLoaderRoute: typeof GameOrderingGameImport
      parentRoute: typeof rootRoute
    }
    '/courses/': {
      id: '/courses/'
      path: '/'
      fullPath: '/courses/'
      preLoaderRoute: typeof CoursesIndexImport
      parentRoute: typeof CoursesRouteImport
    }
    '/_pathlessLayout/_nested-layout/route-a': {
      id: '/_pathlessLayout/_nested-layout/route-a'
      path: '/route-a'
      fullPath: '/route-a'
      preLoaderRoute: typeof PathlessLayoutNestedLayoutRouteAImport
      parentRoute: typeof PathlessLayoutNestedLayoutImport
    }
    '/_pathlessLayout/_nested-layout/route-b': {
      id: '/_pathlessLayout/_nested-layout/route-b'
      path: '/route-b'
      fullPath: '/route-b'
      preLoaderRoute: typeof PathlessLayoutNestedLayoutRouteBImport
      parentRoute: typeof PathlessLayoutNestedLayoutImport
    }
    '/courses_/$postId/deep': {
      id: '/courses_/$postId/deep'
      path: '/courses/$postId/deep'
      fullPath: '/courses/$postId/deep'
      preLoaderRoute: typeof CoursesPostIdDeepImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

interface CoursesRouteRouteChildren {
  CoursesPostIdRoute: typeof CoursesPostIdRoute
  CoursesIndexRoute: typeof CoursesIndexRoute
}

const CoursesRouteRouteChildren: CoursesRouteRouteChildren = {
  CoursesPostIdRoute: CoursesPostIdRoute,
  CoursesIndexRoute: CoursesIndexRoute,
}

const CoursesRouteRouteWithChildren = CoursesRouteRoute._addFileChildren(
  CoursesRouteRouteChildren,
)

interface PathlessLayoutNestedLayoutRouteChildren {
  PathlessLayoutNestedLayoutRouteARoute: typeof PathlessLayoutNestedLayoutRouteARoute
  PathlessLayoutNestedLayoutRouteBRoute: typeof PathlessLayoutNestedLayoutRouteBRoute
}

const PathlessLayoutNestedLayoutRouteChildren: PathlessLayoutNestedLayoutRouteChildren =
  {
    PathlessLayoutNestedLayoutRouteARoute:
      PathlessLayoutNestedLayoutRouteARoute,
    PathlessLayoutNestedLayoutRouteBRoute:
      PathlessLayoutNestedLayoutRouteBRoute,
  }

const PathlessLayoutNestedLayoutRouteWithChildren =
  PathlessLayoutNestedLayoutRoute._addFileChildren(
    PathlessLayoutNestedLayoutRouteChildren,
  )

interface PathlessLayoutRouteChildren {
  PathlessLayoutNestedLayoutRoute: typeof PathlessLayoutNestedLayoutRouteWithChildren
}

const PathlessLayoutRouteChildren: PathlessLayoutRouteChildren = {
  PathlessLayoutNestedLayoutRoute: PathlessLayoutNestedLayoutRouteWithChildren,
}

const PathlessLayoutRouteWithChildren = PathlessLayoutRoute._addFileChildren(
  PathlessLayoutRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/courses': typeof CoursesRouteRouteWithChildren
  '/$postId': typeof PostIdRoute
  '': typeof PathlessLayoutNestedLayoutRouteWithChildren
  '/deferred': typeof DeferredRoute
  '/redirect': typeof RedirectRoute
  '/courses/$postId': typeof CoursesPostIdRoute
  '/game/blind-box-game': typeof GameBlindBoxGameRoute
  '/game/bubble-game': typeof GameBubbleGameRoute
  '/game/link-game': typeof GameLinkGameRoute
  '/game/order-game': typeof GameOrderGameRoute
  '/game/ordering-game': typeof GameOrderingGameRoute
  '/courses/': typeof CoursesIndexRoute
  '/route-a': typeof PathlessLayoutNestedLayoutRouteARoute
  '/route-b': typeof PathlessLayoutNestedLayoutRouteBRoute
  '/courses/$postId/deep': typeof CoursesPostIdDeepRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/$postId': typeof PostIdRoute
  '': typeof PathlessLayoutNestedLayoutRouteWithChildren
  '/deferred': typeof DeferredRoute
  '/redirect': typeof RedirectRoute
  '/courses/$postId': typeof CoursesPostIdRoute
  '/game/blind-box-game': typeof GameBlindBoxGameRoute
  '/game/bubble-game': typeof GameBubbleGameRoute
  '/game/link-game': typeof GameLinkGameRoute
  '/game/order-game': typeof GameOrderGameRoute
  '/game/ordering-game': typeof GameOrderingGameRoute
  '/courses': typeof CoursesIndexRoute
  '/route-a': typeof PathlessLayoutNestedLayoutRouteARoute
  '/route-b': typeof PathlessLayoutNestedLayoutRouteBRoute
  '/courses/$postId/deep': typeof CoursesPostIdDeepRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/courses': typeof CoursesRouteRouteWithChildren
  '/$postId': typeof PostIdRoute
  '/_pathlessLayout': typeof PathlessLayoutRouteWithChildren
  '/deferred': typeof DeferredRoute
  '/redirect': typeof RedirectRoute
  '/_pathlessLayout/_nested-layout': typeof PathlessLayoutNestedLayoutRouteWithChildren
  '/courses/$postId': typeof CoursesPostIdRoute
  '/game/blind-box-game': typeof GameBlindBoxGameRoute
  '/game/bubble-game': typeof GameBubbleGameRoute
  '/game/link-game': typeof GameLinkGameRoute
  '/game/order-game': typeof GameOrderGameRoute
  '/game/ordering-game': typeof GameOrderingGameRoute
  '/courses/': typeof CoursesIndexRoute
  '/_pathlessLayout/_nested-layout/route-a': typeof PathlessLayoutNestedLayoutRouteARoute
  '/_pathlessLayout/_nested-layout/route-b': typeof PathlessLayoutNestedLayoutRouteBRoute
  '/courses_/$postId/deep': typeof CoursesPostIdDeepRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/courses'
    | '/$postId'
    | ''
    | '/deferred'
    | '/redirect'
    | '/courses/$postId'
    | '/game/blind-box-game'
    | '/game/bubble-game'
    | '/game/link-game'
    | '/game/order-game'
    | '/game/ordering-game'
    | '/courses/'
    | '/route-a'
    | '/route-b'
    | '/courses/$postId/deep'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/$postId'
    | ''
    | '/deferred'
    | '/redirect'
    | '/courses/$postId'
    | '/game/blind-box-game'
    | '/game/bubble-game'
    | '/game/link-game'
    | '/game/order-game'
    | '/game/ordering-game'
    | '/courses'
    | '/route-a'
    | '/route-b'
    | '/courses/$postId/deep'
  id:
    | '__root__'
    | '/'
    | '/courses'
    | '/$postId'
    | '/_pathlessLayout'
    | '/deferred'
    | '/redirect'
    | '/_pathlessLayout/_nested-layout'
    | '/courses/$postId'
    | '/game/blind-box-game'
    | '/game/bubble-game'
    | '/game/link-game'
    | '/game/order-game'
    | '/game/ordering-game'
    | '/courses/'
    | '/_pathlessLayout/_nested-layout/route-a'
    | '/_pathlessLayout/_nested-layout/route-b'
    | '/courses_/$postId/deep'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  CoursesRouteRoute: typeof CoursesRouteRouteWithChildren
  PostIdRoute: typeof PostIdRoute
  PathlessLayoutRoute: typeof PathlessLayoutRouteWithChildren
  DeferredRoute: typeof DeferredRoute
  RedirectRoute: typeof RedirectRoute
  GameBlindBoxGameRoute: typeof GameBlindBoxGameRoute
  GameBubbleGameRoute: typeof GameBubbleGameRoute
  GameLinkGameRoute: typeof GameLinkGameRoute
  GameOrderGameRoute: typeof GameOrderGameRoute
  GameOrderingGameRoute: typeof GameOrderingGameRoute
  CoursesPostIdDeepRoute: typeof CoursesPostIdDeepRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  CoursesRouteRoute: CoursesRouteRouteWithChildren,
  PostIdRoute: PostIdRoute,
  PathlessLayoutRoute: PathlessLayoutRouteWithChildren,
  DeferredRoute: DeferredRoute,
  RedirectRoute: RedirectRoute,
  GameBlindBoxGameRoute: GameBlindBoxGameRoute,
  GameBubbleGameRoute: GameBubbleGameRoute,
  GameLinkGameRoute: GameLinkGameRoute,
  GameOrderGameRoute: GameOrderGameRoute,
  GameOrderingGameRoute: GameOrderingGameRoute,
  CoursesPostIdDeepRoute: CoursesPostIdDeepRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/courses",
        "/$postId",
        "/_pathlessLayout",
        "/deferred",
        "/redirect",
        "/game/blind-box-game",
        "/game/bubble-game",
        "/game/link-game",
        "/game/order-game",
        "/game/ordering-game",
        "/courses_/$postId/deep"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/courses": {
      "filePath": "courses/route.tsx",
      "children": [
        "/courses/$postId",
        "/courses/"
      ]
    },
    "/$postId": {
      "filePath": "$postId.tsx"
    },
    "/_pathlessLayout": {
      "filePath": "_pathlessLayout.tsx",
      "children": [
        "/_pathlessLayout/_nested-layout"
      ]
    },
    "/deferred": {
      "filePath": "deferred.tsx"
    },
    "/redirect": {
      "filePath": "redirect.tsx"
    },
    "/_pathlessLayout/_nested-layout": {
      "filePath": "_pathlessLayout/_nested-layout.tsx",
      "parent": "/_pathlessLayout",
      "children": [
        "/_pathlessLayout/_nested-layout/route-a",
        "/_pathlessLayout/_nested-layout/route-b"
      ]
    },
    "/courses/$postId": {
      "filePath": "courses/$postId.tsx",
      "parent": "/courses"
    },
    "/game/blind-box-game": {
      "filePath": "game/blind-box-game.tsx"
    },
    "/game/bubble-game": {
      "filePath": "game/bubble-game.tsx"
    },
    "/game/link-game": {
      "filePath": "game/link-game.tsx"
    },
    "/game/order-game": {
      "filePath": "game/order-game.tsx"
    },
    "/game/ordering-game": {
      "filePath": "game/ordering-game.tsx"
    },
    "/courses/": {
      "filePath": "courses/index.tsx",
      "parent": "/courses"
    },
    "/_pathlessLayout/_nested-layout/route-a": {
      "filePath": "_pathlessLayout/_nested-layout/route-a.tsx",
      "parent": "/_pathlessLayout/_nested-layout"
    },
    "/_pathlessLayout/_nested-layout/route-b": {
      "filePath": "_pathlessLayout/_nested-layout/route-b.tsx",
      "parent": "/_pathlessLayout/_nested-layout"
    },
    "/courses_/$postId/deep": {
      "filePath": "courses_.$postId.deep.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
