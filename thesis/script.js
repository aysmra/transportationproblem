var easyinputs = document.getElementsByTagName("INPUT");
for (var ies = 0; ies < easyinputs.length; ies++)
{
  if (easyinputs[ies].type === 'button')
  { 
    easyinputs[ies].style.visibility='hidden';
    if ((easyinputs[ies].offsetTop-10)<0)
    {
      document.getElementById("overlayLoader").style.top = (document.getElementById('dispCalcConts').offsetTop+(document.getElementById('dispCalcConts').offsetHeight/4))+"px";
    }
		else
		{
			document.getElementById("overlayLoader").style.top = (easyinputs[ies].offsetTop-10)+"px";
		}
  }
  else
  {
    document.getElementById("overlayLoader").style.top = (document.getElementById('dispCalcConts').offsetTop+(document.getElementById('dispCalcConts').offsetHeight/4))+"px";
  }
  if (easyinputs[ies].type === 'reset')
  { 
    easyinputs[ies].style.visibility='hidden';
  }
}