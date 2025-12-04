#!/bin/bash
cd /c/Users/austi/virtual-study-group
echo "===== GIT STATUS ====="
git status
echo ""
echo "===== RECENT COMMITS ====="
git log --oneline -10
echo ""
echo "===== PUSHING TO GITHUB ====="
git push origin main
echo ""
echo "Done!"
