
// Helper logging function
export const logStep = (step: string, details?: any) => {
  const timestamp = new Date().toISOString();
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[${timestamp}] [PROCESS-STRIPE-PAYMENT] ${step}${detailsStr}`);
};
