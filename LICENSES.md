# Lizenzen

Dieses Repository steht unter zwei Lizenzen: der **Quellcode** unter der MIT-Lizenz, die
**Animationen und Illustrationen** unter Creative Commons BY-SA 4.0. Zusätzlich ist Software
Dritter eingebunden, die ihre eigenen Lizenzen behält.

## Quellcode — MIT

Copyright (c) 2026 outermedia GmbH · Volltext in [`LICENSE`](LICENSE)

Gilt für alle Dateien des Repositorys, die nicht ausdrücklich unten aufgeführt sind — insbesondere
`src/**/*.ts`, `src/**/*.vue`, `src/**/*.css`, die Konfigurationsdateien im Wurzelverzeichnis, die
Inhalte von `packages/` sowie die funktionalen Bedienelement-Icons:

```
src/assets/svgs/                  page_left, page_right, refreshIcon, refreshStarIcon, star
src/components/SideModal/icons/   closeIcon, speaker, startIcon, stopIcon, stopIcon2
src/views/HomeView/icons/         speaker, startIcon, stopIcon2
src/themes/icons/info.svg
src/themes/icons/waves.svg, dark_waves.svg, light_waves.svg
```

## Animationen und Illustrationen — CC BY-SA 4.0

Copyright (c) 2026 outermedia GmbH · Volltext in
[`LICENSE-CC-BY-SA-4.0.txt`](LICENSE-CC-BY-SA-4.0.txt)

Diese Dateien dürfen geteilt und bearbeitet werden, sofern die Urheberschaft genannt wird und
Bearbeitungen unter derselben Lizenz weitergegeben werden (ShareAlike):

```
public/animation1.lottie, appear.lottie, swimming.lottie, scene1.json
src/assets/animations/                       alle Lottie-Szenen, character.svg, CharacterC1.png
src/components/GuidingIdeaComponent/icons/   Leitideen-Illustrationen und Emotions-Figuren
src/themes/icons/Bocetos*.png
src/themes/icons/celebrate.png, contemplative.png, Ebene_1.png, solid.png, trophy.png
src/views/BadResultsView/icons/contemplative.png
src/views/CompetenceView/icons/trophy.png
src/views/FinalView/icons/teaser_1.svg, teaser_2.svg, teaser_3.svg
src/views/FinalView/icons/morphIcon1.svg, morphIcon2.svg, morphIcon3.svg
```

Vorgeschlagene Namensnennung bei Weiterverwendung:

> Illustrationen: outermedia GmbH, CC BY-SA 4.0

## Nicht mitlizenziert

`public/om_logo.png` ist das Logo der outermedia GmbH und damit eine Marke. Es ist von beiden
Lizenzen ausgenommen und darf nicht zur Kennzeichnung abgeleiteter Werke verwendet werden.

## Software Dritter

Die npm-Abhängigkeiten behalten ihre jeweiligen Lizenzen. Der Build erzeugt eine
`dist/THIRD-PARTY-NOTICES.txt` mit den vollständigen Lizenztexten aller im Bundle enthaltenen
Pakete.

Die Schriftart **League Spartan** (`src/themes/fonts/*.woff2`) steht unter der
[SIL Open Font License 1.1](https://openfontlicense.org/), Copyright 2020 The League Spartan
Project Authors — der Lizenztext liegt in `src/themes/fonts/OFL.txt`.
