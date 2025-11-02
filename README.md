<p align="center">
  <img src="src/assets/images/icon.png" alt="Colors-LE Logo" width="96" height="96"/>
</p>
<h1 align="center">Colors-LE: Zero Hassle Color Extraction</h1>
<p align="center">
  <b>Extract 1,000+ colors in 0.02 seconds</b> • <b>100x faster than manual</b><br/>
  <i>CSS, HTML, JavaScript, TypeScript, SCSS, LESS, Stylus, and SVG</i>
</p>

<p align="center">
  <a href="https://open-vsx.org/extension/OffensiveEdge/colors-le">
    <img src="https://img.shields.io/badge/Install%20from-Open%20VSX-blue?style=for-the-badge&logo=visualstudiocode" alt="Install from Open VSX" />
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.colors-le">
    <img src="https://img.shields.io/badge/Install%20from-VS%20Code-blue?style=for-the-badge&logo=visualstudiocode" alt="Install from VS Code" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/open-vsx/dt/OffensiveEdge/colors-le?label=downloads&color=green" alt="Downloads" />
  <img src="https://img.shields.io/open-vsx/rating/OffensiveEdge/colors-le?label=rating&color=yellow" alt="Rating" />
  <img src="https://img.shields.io/badge/Open%20Source-100%25-purple" alt="100% Open Source" />
  <img src="https://img.shields.io/badge/Vulnerabilities-0%20Critical-brightgreen" alt="Zero Critical Vulnerabilities" />
</p>

---

<p align="center">
  <img src="src/assets/images/demo.gif" alt="Color Extraction Demo" style="max-width: 100%; height: auto;" />
</p>

<p align="center">
  <img src="src/assets/images/command-palette.png" alt="Command Palette" style="max-width: 80%; height: auto;" />
</p>

---

## ⚡ See It In Action

**Before**: Manually searching through CSS files for brand colors (1 hour)

```css
.header {
  background: #ff5733;
}
.button {
  color: rgb(255, 87, 51);
}
/* ... 200 more colors scattered across 50 files */
```

**After**: One command extracts all 203 colors with analysis in 0.02 seconds

```
Colors: 203 total
Unique: 47 colors
Most used: #FF5733 (23 times)
Format: HEX (60%), RGB (30%), HSL (10%)
Sort by: Hue, Saturation, Lightness
```

**Time Saved**: 1 hour → 1 second ⚡

---

## ✅ Why Colors-LE?

- **1,000+ colors in 0.02 seconds** - 100x faster than manual searching
- **Zero Config** - Install → Press `Cmd+Alt+C` → Get palette instantly
- **Battle-Tested** - 219 unit tests, 89% coverage, zero critical vulnerabilities
- **Security-Hardened** - 89% error handling, path sanitization, safe error reporting

Perfect for design system audits, brand compliance, and accessibility testing.

---

## 🙏 Thank You

If Colors-LE saves you time, a quick rating helps other developers discover it:  
⭐ [Open VSX](https://open-vsx.org/extension/OffensiveEdge/colors-le) • [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.colors-le)

---

### Key Features

- **Color conversion** - Convert between HEX, RGB, HSL, OKLCH formats
- **Palette analysis** - Find most-used colors, duplicates, format distribution
- **Smart sorting** - Sort by hue, saturation, lightness, or alphabetically
- **7 file types** - CSS, SCSS, LESS, Stylus, HTML, JavaScript/TypeScript, SVG
- **Format detection** - HEX, RGB/RGBA, HSL/HSLA, named colors, CSS variables
- **13 languages** - English, Chinese, German, Spanish, French, Indonesian, Italian, Japanese, Korean, Portuguese, Russian, Ukrainian, Vietnamese

## 🚀 More from the LE Family

- **[String-LE](https://open-vsx.org/extension/OffensiveEdge/string-le)** - Extract user-visible strings for i18n and validation • [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.string-le)
- **[Numbers-LE](https://open-vsx.org/extension/OffensiveEdge/numbers-le)** - Extract and analyze numeric data with statistics • [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.numbers-le)
- **[EnvSync-LE](https://open-vsx.org/extension/OffensiveEdge/envsync-le)** - Keep .env files in sync with visual diffs • [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.envsync-le)
- **[Paths-LE](https://open-vsx.org/extension/OffensiveEdge/paths-le)** - Extract file paths from imports and dependencies • [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.paths-le)
- **[Scrape-LE](https://open-vsx.org/extension/OffensiveEdge/scrape-le)** - Validate scraper targets before debugging • [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.scrape-le)
- **[URLs-LE](https://open-vsx.org/extension/OffensiveEdge/urls-le)** - Extract URLs from web content and APIs • [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.urls-le)
- **[Dates-LE](https://open-vsx.org/extension/OffensiveEdge/dates-le)** - Extract temporal data from logs and APIs • [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.dates-le)

## 💡 Use Cases

- **Design System Auditing** - Extract all colors from stylesheets for consistency validation
- **Theme Development** - Pull color palettes from CSS variables and design tokens
- **Brand Compliance** - Find all brand colors across your codebase for validation
- **Accessibility Analysis** - Extract colors for contrast ratio and accessibility testing

## 🚀 Quick Start

1. Install from [Open VSX](https://open-vsx.org/extension/OffensiveEdge/colors-le) or [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nolindnaidoo.colors-le)
2. Open any supported file type (`Cmd/Ctrl + P` → search for "Colors-LE")
3. Run Quick Extract (`Cmd+Alt+C` / `Ctrl+Alt+C` / Status Bar)

## ⚙️ Configuration

Colors-LE has minimal configuration to keep things simple. Most settings are available in VS Code's settings UI under "Colors-LE".

Key settings include:

- Output format preferences (side-by-side, clipboard copy)
- Safety warnings and thresholds for large files
- Notification levels (silent, important, all)
- Status bar visibility
- Local telemetry logging for debugging

For the complete list of available settings, open VS Code Settings and search for "colors-le".

## 🌍 Language Support

🇺🇸 **English** • 🇩🇪 **German** • 🇪🇸 **Spanish** • 🇫🇷 **French** • 🇮🇩 **Indonesian** • 🇮🇹 **Italian** • 🇯🇵 **Japanese** • 🇰🇷 **Korean** • 🇧🇷 **Portuguese (Brazil)** • 🇷🇺 **Russian** • 🇺🇦 **Ukrainian** • 🇻🇳 **Vietnamese** • 🇨🇳 **Chinese (Simplified)**

## 🧩 System Requirements

**VS Code** 1.70.0+ • **Platform** Windows, macOS, Linux  
**Memory** 200MB recommended for large files

## 🔒 Privacy

100% local processing. No data leaves your machine. Optional logging: `colors-le.telemetryEnabled`

## ⚡ Performance

<!-- PERFORMANCE_START -->

Colors-LE is built for speed and efficiently processes files from 1KB to 100KB+. See [detailed benchmarks](docs/PERFORMANCE.md).

For detailed information, see [Performance Monitoring](docs/PERFORMANCE.md).

**Performance Characteristics:**

- Handles files up to 100KB efficiently
- Practical limit: 1MB (with warning), 10MB (error threshold)
- Built-in real-time performance tracking
- Optimized for design systems and large codebases

**Note**: Performance varies based on file content, format, and hardware. Files without colors process faster but extract 0 colors.  
**Full Metrics**: [docs/PERFORMANCE.md](docs/PERFORMANCE.md) • Test Environment: macOS, Bun 1.2.22, Node 22.x

<!-- PERFORMANCE_END -->

## 🔧 Troubleshooting

**Not detecting colors?**  
Ensure file is saved with supported extension (.css, .html, .js, .ts, .scss, .less, .styl, .svg)

**Large files slow?**  
Files over 1MB may take longer. Consider splitting into smaller chunks

**Need help?**  
Check [Issues](https://github.com/OffensiveEdge/colors-le/issues) or enable logging: `colors-le.telemetryEnabled: true`

## ❓ FAQ

**What colors are extracted?**  
HEX (#rgb, #rrggbb, #rrggbbaa), RGB/RGBA, HSL/HSLA, and named colors

**Can I convert between formats?**  
Yes, use the Convert command to transform colors between HEX, RGB, HSL, and OKLCH formats

**Max file size?**  
Up to 10MB. Practical limit: 1MB for optimal performance

**Perfect for design systems?**  
Absolutely! Audit color palettes, validate brand consistency, and analyze theme implementations

## 📊 Testing

**219 unit tests** • **89% function coverage, 74% line coverage**  
Powered by Vitest • Run with `bun test --coverage`

### Core Principle

**No broken or failed tests are allowed in commits.** All tests must pass before code can be committed or merged.

### Test Suite Highlights

- **44 error handling tests** with 89% coverage
- **Comprehensive color format support** (HEX, RGB/RGBA, HSL/HSLA, named colors)
- **CSS, SCSS, LESS, Stylus, HTML, JS/TS, SVG** extraction validation

For detailed testing guidelines, see [Testing Guidelines](docs/TESTING.md).

---

Copyright © 2025
<a href="https://github.com/OffensiveEdge">@OffensiveEdge</a>. All rights reserved.
