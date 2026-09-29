ОТ ТРЕВОГИ - К ЯСНОСТИ · Prototype v3.7
Разработано: Спирин Александр

ПУБЛИКАЦИЯ НА GITHUB PAGES
1. Загрузите ВСЕ файлы из этой папки в корень репозитория GitHub.
2. Settings -> Pages -> Deploy from a branch -> main -> /(root) -> Save.
3. После публикации откройте выданную HTTPS-ссылку на iPhone.

АНОНИМНАЯ АНАЛИТИКА
Приложение никогда не отправляет текст тревоги: текстовых полей в нём нет.
События: session_started, reached_control, completed, clarity_yes, clarity_partial, clarity_no, safety_exit, worksheet_opened.

По умолчанию события сохраняются только локально в браузере тестера и НЕ видны владельцу сайта.
Чтобы собирать агрегированные события от всех тестеров, можно подключить GoatCounter:
1. Создайте сайт в GoatCounter и получите site code.
2. Откройте config.js.
3. Вставьте code в goatcounterCode:'ВАШ_CODE'.
4. Загрузите обновлённый config.js в GitHub.
Содержимое тревоги, имя и email приложением не собираются.

ФАЙЛЫ
index.html - сайт
screens.js - тексты и ветвления
app.js - логика, аудио и события
config.js - конфигурация аналитики
Спокойный фон v3.7 генерируется локально браузером и не использует внешний аудиофайл. - собственный тестовый спокойный фон
worksheet-v3.pdf - новый рабочий бланк A4


v3.7: cache-busting для Safari/iPhone; старый ambient.mp3 не используется; спокойный фон генерируется локально браузером.


v3.7: спокойный фон заменён на лицензированный файл calm-background.wav (Main, предоставлен владельцем проекта). Плавный fade-in/fade-out; при завершении 7-минутного трека во время активной сессии — мягкий перезапуск.


v3.7: licensed 7-minute background converted from WAV to 128 kbps MP3 for GitHub browser upload (<25 MB). Audio behavior unchanged.


v3.7 Analytics
---------------
GoatCounter site code: wouldithelp

External analytics contains only anonymous product events. No free-text answers,
anxiety content, names, email addresses, or account data are sent by the app.

Events:
- session_started
- reached_control
- completed / session_completed
- clarity_yes
- clarity_partial
- clarity_no
- worksheet_opened
- ambient_on
- ambient_off
- safety_exit

The app also retains a bounded local technical event log in the browser for prototype debugging.


v3.7 Branding & Sharing
-----------------------
Brand mark: «Точка ясности».
Added favicon, Apple Touch icon, PWA manifest/icons, social preview image,
and a final-screen Share button using the device's native Share Sheet.
Anonymous analytics adds: share_clicked.


v3.7 Campaign Analytics
-----------------------
Adds anonymous event app_opened and campaign attribution from:
utm_source, utm_campaign, utm_content.

No free text, anxiety content, name, email, IP-derived identifier, or ad-platform
user identifier is added by this app.

Example campaign URLs:
?utm_source=tiktok&utm_campaign=alpha01&utm_content=facts
?utm_source=tiktok&utm_campaign=alpha01&utm_content=privacy
?utm_source=tiktok&utm_campaign=alpha01&utm_content=control

GoatCounter event paths are segmented like:
event/app_opened/src-tiktok/cmp-alpha01/cnt-facts
event/session_started/src-tiktok/cmp-alpha01/cnt-facts
event/reached_control/src-tiktok/cmp-alpha01/cnt-facts
event/clarity_yes/src-tiktok/cmp-alpha01/cnt-facts
event/share_clicked/src-tiktok/cmp-alpha01/cnt-facts
