#!/bin/bash

# Example of tab stripping heredoc syntax
# The <<- operator strips leading tabs (but not spaces) from the content

echo "=== Basic heredoc (no tab stripping) ==="
cat << EOF
	This line has a tab
	This line also has a tab
		This line has two tabs
EOF

echo -e "\n=== Tab stripping heredoc (<<-) ==="
cat <<- EOF
	This line has a tab (will be stripped)
	This line also has a tab (will be stripped)
		This line has two tabs (will be stripped)
EOF

echo -e "\n=== Tab stripping with mixed indentation ==="
cat <<- EOF
	This line has a tab (will be stripped)
  This line has spaces (will NOT be stripped)
		This line has two tabs (will be stripped)
    This line has spaces (will NOT be stripped)
EOF

echo -e "\n=== Tab stripping in a function ==="
create_config() {
	cat <<- CONFIG
		# Configuration file
		# Generated automatically

		server_name = "example.com"
		port = 8080
		database = "mydb"
	CONFIG
}

create_config

echo -e "\n=== Tab stripping with variables ==="
USER_NAME="John"
cat <<- GREETING
	Hello $USER_NAME!
	Welcome to our system.
		We hope you enjoy your stay.
GREETING