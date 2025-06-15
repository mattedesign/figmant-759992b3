
-- Enable real-time updates for the analysis tables
-- Add tables to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE design_analysis;
ALTER PUBLICATION supabase_realtime ADD TABLE design_batch_analysis;
ALTER PUBLICATION supabase_realtime ADD TABLE design_uploads;

-- Set REPLICA IDENTITY FULL to ensure complete row data is captured during updates
ALTER TABLE design_analysis REPLICA IDENTITY FULL;
ALTER TABLE design_batch_analysis REPLICA IDENTITY FULL;
ALTER TABLE design_uploads REPLICA IDENTITY FULL;
