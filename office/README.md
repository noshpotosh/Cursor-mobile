# Warewolf Virtual Office

Internal isometric pixel office for Warewolf.

## Status

- **Phase 0:** art + product lock — done
- **Phase 1:** dead office shell — HTML + isometric floor + desk placeholders

## Run

Serve this folder over HTTP (ES modules + `fetch` need it):

```bash
cd office
python3 -m http.server 8765
```

Open [http://127.0.0.1:8765](http://127.0.0.1:8765).

## Docs

- [Product scope ADR](../docs/office/decisions/001-virtual-office-scope.md)
- [Art direction](../docs/office/art-direction.md)
- [Asset pipeline](../docs/office/asset-pipeline.md)

## Reference mocks

- [Starter office hero](assets/reference/starter-office-hero-mock.png)
- [Desk desktop OS](assets/reference/desk-desktop-os-mock.png)
