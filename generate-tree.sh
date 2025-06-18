#!/bin/bash

OUTPUT_FILE="project-tree.md"
INDENT_CHAR="│   "
BRANCH_CHAR="├── "
LAST_BRANCH_CHAR="└── "

# Clear output file
> "$OUTPUT_FILE"

generate_tree() {
    local prefix="$1"
    local path="$2"
    local files=()
    local dirs=()

    # Separate files and directories
    while IFS= read -r -d '' entry; do
        if [ -f "$entry" ]; then
            files+=("$entry")
        elif [ -d "$entry" ]; then
            dirs+=("$entry")
        fi
    done < <(find "$path" -maxdepth 1 -mindepth 1 -print0 | sort -z)

    # Process directories
    local dir_count=${#dirs[@]}
    local current_dir=0
    for dir in "${dirs[@]}"; do
        ((current_dir++))
        local basename=$(basename "$dir")
        
        # Skip excluded directories
        if [[ "$basename" =~ ^(node_modules|\.git|dist|\.angular|build|coverage)$ ]]; then
            continue
        fi

        if [ $current_dir -eq $dir_count ]; then
            echo "$prefix$LAST_BRANCH_CHAR$basename/" >> "$OUTPUT_FILE"
            generate_tree "$prefix$INDENT_CHAR" "$dir"
        else
            echo "$prefix$BRANCH_CHAR$basename/" >> "$OUTPUT_FILE"
            generate_tree "$prefix$INDENT_CHAR" "$dir"
        fi
    done

    # Process files
    local file_count=${#files[@]}
    local current_file=0
    for file in "${files[@]}"; do
        ((current_file++))
        local basename=$(basename "$file")
        local extension="${basename##*.}"

        # Only process relevant file types
        if [[ "$extension" =~ ^(ts|js|html|scss|sass|json|md)$ ]]; then
            if [ $current_file -eq $file_count ]; then
                echo "$prefix$LAST_BRANCH_CHAR$basename" >> "$OUTPUT_FILE"
            else
                echo "$prefix$BRANCH_CHAR$basename" >> "$OUTPUT_FILE"
            fi
        fi
    done
}

# Generate tree structure
echo "# Project Structure" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "## Backend" >> "$OUTPUT_FILE"
echo '```' >> "$OUTPUT_FILE"
generate_tree "" "./backend-adonis"
echo '```' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "## Frontend" >> "$OUTPUT_FILE"
echo '```' >> "$OUTPUT_FILE"
generate_tree "" "./client"
echo '```' >> "$OUTPUT_FILE"

echo "Tree structure generated in $OUTPUT_FILE"