# Windows visual testing troubleshooting

If Chromatic's archive build exits with code `3221226505` and
`Assertion failed: process_title`, reset the console title in the same terminal:

```powershell
cmd /c "title VisitScotland visual tests"
yarn chromatic --playwright
```

This matches a Windows console-title bug in Node/libuv:
https://github.com/nodejs/node/issues/58695.

If it persists, retry in a fresh terminal. Check `node --version` and
`where.exe node` there for an older Node installation on PATH.

An empty archive directory is not a captured test suite. The repository's
`yarn chromatic` command now runs Playwright in capture mode before uploading:

```powershell
yarn chromatic --playwright --project-token=YOUR_PROJECT_TOKEN
```

CI uses `yarn chromatic:upload --playwright` to upload archives already produced
by its capture job. Do not use that upload-only command before generating captures.
