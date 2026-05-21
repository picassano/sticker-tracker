@echo off
echo === Buoc 1: Cau hinh Git ===
"C:\Program Files\Git\cmd\git.exe" config --global user.name "picassano"
"C:\Program Files\Git\cmd\git.exe" config --global user.email "picassano@users.noreply.github.com"

echo.
echo === Buoc 2: Khoi tao repo ===
"C:\Program Files\Git\cmd\git.exe" init

echo.
echo === Buoc 3: Them tat ca file ===
"C:\Program Files\Git\cmd\git.exe" add .

echo.
echo === Buoc 4: Commit dau tien ===
"C:\Program Files\Git\cmd\git.exe" commit -m "Initial commit - Sticker Tracker Phase 10 complete"

echo.
echo === Buoc 5: Doi branch thanh main ===
"C:\Program Files\Git\cmd\git.exe" branch -M main

echo.
echo === Buoc 6: Ket noi voi GitHub ===
"C:\Program Files\Git\cmd\git.exe" remote add origin https://github.com/picassano/sticker-tracker.git

echo.
echo === Buoc 7: Dang len GitHub ===
echo Ban se duoc yeu cau dang nhap GitHub - chon "Sign in with browser"
"C:\Program Files\Git\cmd\git.exe" push -u origin main

echo.
echo === HOAN THANH! ===
echo Code da len GitHub tai: https://github.com/picassano/sticker-tracker
pause
