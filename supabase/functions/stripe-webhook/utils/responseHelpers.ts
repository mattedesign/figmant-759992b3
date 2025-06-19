
export const createSuccessResponse = (message: string, statusCode: number = 200) => {
  return new Response(JSON.stringify({ 
    received: true, 
    message 
  }), {
    headers: { "Content-Type": "application/json" },
    status: statusCode,
  });
};

export const createErrorResponse = (message: string, statusCode: number = 400) => {
  return new Response(message, { 
    status: statusCode 
  });
};
