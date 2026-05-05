#!/bin/sh
# bb — Beebeeb CLI installer
# Usage: curl -sSf https://beebeeb.io/install.sh | sh
#
# This script detects your platform and installs the latest `bb` binary from
# the GitHub release. It is a thin wrapper around cargo-dist's generated
# installer — kept in sync via the release pipeline.
#
# Supported platforms:
#   - macOS (Apple Silicon, Intel)
#   - Linux x86_64, ARM64
#   - Windows: use Scoop or download directly from GitHub Releases
#
# Source: https://github.com/beebeeb-io/cli

set -e

REPO="beebeeb-io/cli"
BIN="bb"

main() {
    # Redirect to cargo-dist's generated installer hosted on GitHub Releases
    # We fetch the latest release tag and forward to the canonical installer.

    LATEST_URL="https://github.com/${REPO}/releases/latest/download/beebeeb-cli-installer.sh"

    if command -v curl >/dev/null 2>&1; then
        curl --proto '=https' --tlsv1.2 -LsSf "$LATEST_URL" | sh
    elif command -v wget >/dev/null 2>&1; then
        wget -qO- "$LATEST_URL" | sh
    else
        echo "error: neither curl nor wget found. Install one and re-run." >&2
        exit 1
    fi
}

main "$@"
