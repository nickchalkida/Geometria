
function onToolClick(tid) {
  
    if (cur_tool_id != "") {
        document.getElementById(cur_tool_id).className = "toolitem"
    }
    
    cur_tool_id = tid;
    document.getElementById(cur_tool_id).className = "toolitem_selected"
}
