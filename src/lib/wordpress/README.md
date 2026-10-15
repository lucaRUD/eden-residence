# Reserved WordPress boundary

Phase 1 intentionally contains no API client, network requests, credentials, or WordPress plugin code.

After approval, this directory will own build-time REST access, response validation, pagination, locale mapping, and normalized frontend content types. Components should consume those normalized types rather than WordPress response objects.

See [the architecture plan](../../../docs/ARCHITECTURE.md) for the proposed content model and rebuild workflow. `.env.example` documents the future `WORDPRESS_URL`; initialization does not require a `.env` file.
