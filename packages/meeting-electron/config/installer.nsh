!macro customInstall
  DetailPrint "Register dxzmeeting URI Handler"
  DeleteRegKey HKCR "xzmeeting"
  WriteRegStr HKCR "xzmeeting" "" "URL:xzmeeting"
  WriteRegStr HKCR "xzmeeting" "URL Protocol" ""
  WriteRegStr HKCR "xzmeeting\shell" "" ""
  WriteRegStr HKCR "xzmeeting\shell\Open" "" ""
  WriteRegStr HKCR "xzmeeting\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend
!macro customUnInstall
    DeleteRegKey HKCR "xzmeeting"
!macroend
