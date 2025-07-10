#!/bin/bash

# File: generate-structure.sh

OUTPUT_FILE="project-structure.md"

# Clear or create the output file
> "$OUTPUT_FILE"

# Function to process a directory
process_directory() {
  local dir="$1"
  local indent="$2"
  
  # List files and directories, sorted alphabetically
  for item in $(ls -A "$dir" | sort); do
    # Skip node_modules, .git, and other common excludes
    if [[ "$item" == "node_modules" ]] || 
       [[ "$item" == ".git" ]] || 
       [[ "$item" == "dist" ]] || 
       [[ "$item" == ".angular" ]] || 
       [[ "$item" == "build" ]]; then
      continue
    fi
    
    local full_path="$dir/$item"
    
    if [ -d "$full_path" ]; then
      # Directory - print with trailing slash
      echo "${indent}${item}/" >> "$OUTPUT_FILE"
      process_directory "$full_path" "  ${indent}"
    else
      # File - print name and first few lines if it's a relevant file
      case "$item" in
        *.ts|*.js|*.html|*.sass|*.json|*.md)
          echo "${indent}${item}" >> "$OUTPUT_FILE"
          echo "Here is a potentially relevant text excerpt in \`${full_path#./}\` starting at line 0:" >> "$OUTPUT_FILE"
          echo '```'${item##*.} >> "$OUTPUT_FILE"
          head -n 5 "$full_path" >> "$OUTPUT_FILE"
          echo '```' >> "$OUTPUT_FILE"
          echo "" >> "$OUTPUT_FILE"
          ;;
      esac
    fi
  done
}

# Generate structure for both backend and client
echo "# Backend Structure" >> "$OUTPUT_FILE"
echo '```' >> "$OUTPUT_FILE"
process_directory "./backend-adonis" ""
echo '```' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "# Client Structure" >> "$OUTPUT_FILE"
echo '```' >> "$OUTPUT_FILE"
process_directory "./client" ""
echo '```' >> "$OUTPUT_FILE"

echo "Project structure has been generated in $OUTPUT_FILE"