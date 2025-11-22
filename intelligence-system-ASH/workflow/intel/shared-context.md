📊 Index: 0.04MB | Updated: 10/20/2025, 3:43:50 PM
Code Intelligence CLI v3.0
=========================

Commands:
  find         Find files matching pattern
  content      Search file contents via ripgrep
  files        Find files via fd
  structure    Show shallow directory tree via fd
  symbol       Find symbols/functions
  callers      Find who calls a function
  deps         Show file dependencies
  hotspots     Identify code hotspots
  patterns     Detect code patterns and smells
  graph        Graph operations
  overview     Generate project overview
  feature      Analyze feature development
  bug          Investigate bug patterns
  refactor     Analyze refactoring impact
  format       Format last result
  fzf          Interactive file picker via fd + fzf
  preset       Run preset analyses (compact|standard|extended)
  chain        Run a sequence of analyses from a JSON file
  query        Run raw jq query
  cod          Chain of Drafts mode
  help         Show help

Examples:
  code-intel find payment        # Fuzzy find payment files
  code-intel hotspots 5          # Top 5 hotspots
  code-intel overview 90         # 90-second overview
  code-intel files "decision"    # fd search for files
  code-intel content "use client" --type ts  # rg content search
  code-intel bug "undefined"     # Investigate undefined errors
  code-intel graph path fn1 fn2  # Find path between functions
  code-intel preset compact      # Run the compact preset (overview + hotspots)
  code-intel chain workflow.json # Run a custom analysis chain from JSON
