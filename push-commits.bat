@echo off
cd /d c:\Users\austi\virtual-study-group
echo Checking git status...
git status
echo.
echo Checking recent commits...
git log --oneline -10
echo.
echo Pushing to remote...
git push origin main
pause
