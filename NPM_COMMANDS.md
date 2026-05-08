# NPM Commands Reference

Quick reference for common npm commands used in this project.

## Installation & Setup

```bash
# Install all dependencies
npm install

# Install a specific package
npm install package-name

# Install a dev dependency (for development only)
npm install --save-dev package-name

# Remove a package
npm uninstall package-name

# Update all packages
npm update

# Clean cache (if having issues)
npm cache clean --force
```

## Development

```bash
# Start development server (http://localhost:3000)
npm run dev

# Start on different port
npm run dev -- -p 3001

# Build for production
npm run build

# Start production server (requires npm run build first)
npm start

# Run linter
npm run lint
```

## Debugging

```bash
# Check which version of a package is installed
npm list package-name

# Check outdated packages
npm outdated

# Show why a package is installed
npm why package-name

# View full list of installed packages
npm list
```

## Troubleshooting

```bash
# Clear all npm cache
npm cache clean --force

# Reinstall dependencies completely
rm -rf node_modules package-lock.json
npm install

# Verify npm installation
npm --version
node --version

# Check for vulnerabilities in packages
npm audit

# Fix vulnerabilities automatically
npm audit fix
```

## Project-Specific Commands

```bash
# Development workflow
npm install              # Initial setup
npm run dev            # Start development server
npm run build          # Check for build errors
npm run lint           # Check code quality

# After making changes
npm run dev            # Dev server auto-reloads

# Before pushing to production
npm run build          # Verify build succeeds
npm run lint           # Check code quality
```

## Useful npm Tips

### Speed up installation
```bash
npm install --prefer-offline --no-audit
```

### See what npm will do (dry run)
```bash
npm install --dry-run
```

### Save exact versions (no flexibility)
```bash
npm install --save-exact package-name
```

### Interactive package installer
```bash
npm install -i
```

## Environment & Configuration

```bash
# Check npm configuration
npm config list

# Set a configuration value
npm config set init-author-name "Your Name"

# View packages root
npm root

# View global packages
npm list -g

# Get npm info
npm info package-name
```

## Package.json Scripts

In this project, these scripts are defined in `package.json`:

| Command | What it does |
|---------|-------------|
| `npm run dev` | Starts Next.js dev server with hot reload |
| `npm run build` | Creates optimized production build |
| `npm start` | Runs the production build |
| `npm run lint` | Checks code for issues with ESLint |

## Common Errors & Solutions

### "npm: command not found"
```bash
# Solution: Node.js/npm not installed
# Download from https://nodejs.org/
# Restart terminal after installing
```

### "npm ERR! code ERESOLVE"
```bash
# Solution: Dependency conflict, try:
npm install --legacy-peer-deps
# Or update packages:
npm update
```

### "npm ERR! EACCES: permission denied"
```bash
# Solution: Fix npm permissions
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### "npm ERR! 404"
```bash
# Solution: Package not found
# Check spelling and try:
npm cache clean --force
npm install
```

## Version Ranges

In package.json, you might see different version formats:

```json
{
  "exact": "1.2.3",           // Exact version only
  "compatible": "~1.2.3",     // Bug fix updates only
  "flexible": "^1.2.3",       // Minor and bug fix updates (default)
  "latest": "*"               // Latest version (risky)
}
```

## Useful npm Shortcuts

```bash
# Short form of commands
npm i                   # npm install
npm i -D                # npm install --save-dev
npm i -S                # npm install --save
npm rm                  # npm uninstall
npm t                   # npm test
npm ls                  # npm list
npm up                  # npm update
```

## Advanced: Using npm Scripts

```bash
# Run multiple commands in sequence
npm run build && npm run dev

# Run with arguments
npm run dev -- --port 3001

# Pre/post scripts (auto-run)
# Example: "pretest" runs before "npm test"
```

## Resources

- npm official docs: https://docs.npmjs.com/
- Node.js: https://nodejs.org/
- npm search: https://www.npmjs.com/

## Quick Start Summary

```bash
# Everything you need to get started:

npm install              # Install dependencies
npm run dev            # Start development server
# Open http://localhost:3000 in browser
# Start developing!

# When you're done:
npm run build          # Verify build works
npm run lint           # Check code quality
# Ready to deploy!
```

---

**Remember:** Most development happens with `npm run dev` running in your terminal!
