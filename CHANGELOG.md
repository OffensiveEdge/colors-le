# Changelog

All notable changes to Colors-LE will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.8.0] - 2025-10-26

### Security & Enterprise Readiness

- **Error Handling Hardening** - Expanded from 45% to 89% coverage with 44 comprehensive tests:
  - Path sanitization for sensitive directories
  - Error categorization (parse, file-system, configuration, validation, safety, operational)
  - Recovery options with retry mechanisms
  - User-friendly error messages
  - Error context handling without information leakage
  - Severity classification (critical, error, warning, info)
- **Color Format Validation** - Comprehensive testing for:
  - HEX color parsing (#RGB, #RRGGBB, #RRGGBBAA)
  - RGB/RGBA validation and conversion
  - HSL/HSLA validation and conversion
  - Named color recognition
  - CSS variable handling
  - Malformed input rejection
- **Test Suite Expansion** - Increased from 76 to 219 unit tests (+188%)
  - 89% function coverage, 74% line coverage
  - Zero critical vulnerabilities
  - Enterprise-grade reliability

### Quality Improvements

- **Type Safety** - 100% TypeScript strict mode compliance
- **Immutability** - All exports frozen with `Object.freeze()`
- **Dependency Security** - Zero vulnerabilities in dependency chain

## [1.7.0] - 2025-01-27

### Initial Public Release

Colors-LE brings zero-hassle color extraction to VS Code. Simple, reliable, focused.

#### Supported File Types

- **CSS** - Stylesheets with all standard color formats
- **HTML** - Inline styles and style tags
- **JavaScript** - JS, JSX with styled components support
- **TypeScript** - TS, TSX with styled components support
- **SVG** - Scalable Vector Graphics files

#### Color Formats

- **HEX** - 3-digit (#fff), 6-digit (#ffffff), 8-digit with alpha (#ffffffaa)
- **RGB/RGBA** - rgb(255, 255, 255), rgba(255, 255, 255, 0.5)
- **HSL/HSLA** - hsl(0, 0%, 100%), hsla(0, 0%, 100%, 0.5)

#### Features

- **Multi-language support** - Comprehensive localization for 12+ languages
- **Original format output** - Shows colors exactly as they appear in your code
- **Smart deduplication** - Optional removal of duplicate colors
- **Multiple sort modes** - Sort by hue, saturation, lightness, or hex value
- **Safety warnings** - Alerts for large files (configurable thresholds)
- **Clipboard integration** - Optional auto-copy to clipboard
- **One-command extraction** - `Ctrl+Alt+C` (`Cmd+Alt+C` on macOS)
- **Side-by-side results** - Open results alongside source files
- **Minimal notifications** - Silent by default, configurable levels
- **Robust infrastructure** - Verified activation events, command registry, and components
- **Developer-friendly** - 13 essential settings, 76 passing tests (76.76% function coverage, 73.88% line coverage), TypeScript strict mode, functional programming, MIT licensed

#### Performance

- **High-speed processing** - Efficiently processes large design systems
- **Large file support** - Handles enterprise codebases without slowdown
- **Memory efficient** - Optimized for large design systems

#### Use Cases

- **Design System Auditing** - Extract all colors from stylesheets for consistency validation
- **Theme Development** - Pull color palettes from CSS variables and design tokens
- **Brand Compliance** - Find all brand colors across your codebase for validation
- **Accessibility Analysis** - Extract colors for contrast ratio and accessibility testing
