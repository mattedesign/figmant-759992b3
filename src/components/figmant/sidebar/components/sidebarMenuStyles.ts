
import { cn } from '@/lib/utils';

export const getMenuItemButtonStyles = (isActive: boolean) => {
  return cn(
    "w-full justify-start text-left h-10 px-2 group",
    isActive
      ? "bg-white text-[#3D4A5C] rounded-[12px] shadow-[0px_1.25px_3px_0px_rgba(50,50,50,0.10),0px_1.25px_1px_0px_#FFF_inset]"
      : "hover:bg-[#1812E9] hover:text-[#3D4A5C] hover:rounded-[12px] hover:shadow-[0px_1.25px_3px_0px_rgba(50,50,50,0.10),0px_1.25px_1px_0px_#FFF_inset]"
  );
};

export const getMenuItemButtonInlineStyles = (isActive: boolean) => {
  return {
    display: 'flex',
    height: '40px',
    padding: '4px 8px 4px 4px',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: '12px',
    background: isActive 
      ? 'rgba(10, 169, 255, 0.16)' 
      : 'var(--Surface-01, #FCFCFC)'
  };
};

export const getIconContainerStyles = (isActive: boolean) => {
  return cn(
    "w-8 h-8 mr-1 rounded-[8px] flex items-center justify-center transition-all",
    isActive ? "bg-white" : "bg-[var(--Surface-03,#F1F1F1)] group-hover:bg-white"
  );
};

export const getIconStyles = (isActive: boolean) => {
  return cn(
    "h-4 w-4 transition-all",
    isActive 
      ? "text-[#1812E9] fill-current" 
      : "text-[#455468] group-hover:text-[#1812E9] group-hover:fill-current"
  );
};

export const getLabelStyles = (isActive: boolean) => {
  return cn(
    "flex-1 text-left transition-all",
    isActive 
      ? "text-[#1812E9] font-medium" 
      : "text-[#455468] font-medium group-hover:text-white"
  );
};

export const getActiveLabelInlineStyles = () => {
  return {
    overflow: 'hidden',
    color: '#1812E9',
    textOverflow: 'ellipsis',
    fontFamily: '"Instrument Sans"',
    fontSize: '13px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'auto',
    letterSpacing: '-0.12px',
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    transition: 'all 0.2s ease'
  };
};

export const getInactiveLabelInlineStyles = () => {
  return {
    overflow: 'hidden',
    color: 'var(--Text-Primary, #121212)',
    textOverflow: 'ellipsis',
    fontFamily: '"Instrument Sans"',
    fontSize: '13px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '20px',
    letterSpacing: '-0.12px',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    transition: 'all 0.2s ease'
  };
};

export const getMenuSectionContainerStyles = (isFirst: boolean) => {
  return {
    display: 'flex',
    padding: '12px',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    alignSelf: 'stretch',
    ...(isFirst ? {} : { borderTop: '1px solid var(--Stroke-01, #ECECEC)' })
  };
};
