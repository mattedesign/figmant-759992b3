
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const createSuccessResponse = (message: string, data?: any) => {
  return new Response(JSON.stringify({ 
    success: true,
    message,
    ...data
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
};

export const createErrorResponse = (message: string, status: number = 500, details?: string) => {
  return new Response(JSON.stringify({ 
    error: message,
    ...(details && { details })
  }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
};

export const createCorsResponse = () => {
  return new Response(null, { headers: corsHeaders });
};
