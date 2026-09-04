/**
 * Chemin de production — remplace construire.mjs quand le projet passe en natif.
 *   npm i -D style-dictionary
 *   npx style-dictionary build --config design/style-dictionary.config.mjs
 *
 * Le format d'entrée ne change pas : ce sont les mêmes fichiers DTCG.
 * Style Dictionary v4 lit nativement le format du W3C Design Tokens
 * Community Group et sait produire Swift, Kotlin et Compose en plus du CSS.
 */
export default {
  source: ["design/tokens/*.json"],
  preprocessors: ["tokens-studio"],
  platforms: {
    css:      { transformGroup: "css",           buildPath: "design/build/", files: [{ destination: "tokens.css", format: "css/variables", options: { outputReferences: true } }] },
    js:       { transformGroup: "js",            buildPath: "design/build/", files: [{ destination: "tokens.ts",  format: "javascript/esm" }] },
    ios:      { transformGroup: "ios-swift",     buildPath: "design/build/ios/",     files: [{ destination: "Tokens.swift",  format: "ios-swift/class.swift", options: { className: "CaminsTokens" } }] },
    android:  { transformGroup: "compose",       buildPath: "design/build/android/", files: [{ destination: "Tokens.kt",     format: "compose/object", options: { className: "CaminsTokens", packageName: "fr.pointspo.camins" } }] }
  }
};
