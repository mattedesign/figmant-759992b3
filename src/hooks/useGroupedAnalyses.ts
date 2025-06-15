
import { useMemo } from 'react';
import { DesignUpload, DesignAnalysis, DesignBatchAnalysis } from '@/types/design';

interface Analysis {
  id: string;
  type: string;
  title: string;
  status: string;
  created_at: string;
  confidence_score: number;
  analysis_type: string;
  upload_count: number;
  winner_upload_id: string | null;
  batch_name: string | null;
  rawData: any;
  relatedUpload?: any;
  relatedUploads?: any[];
}

interface GroupedAnalysis {
  id: string;
  groupTitle: string;
  groupType: 'batch' | 'individual';
  primaryAnalysis: Analysis;
  relatedAnalyses: Analysis[];
  totalUploads: number;
  latestDate: string;
  overallConfidence: number;
}

export const useGroupedAnalyses = (
  uploads: DesignUpload[],
  individualAnalyses: DesignAnalysis[],
  batchAnalyses: DesignBatchAnalysis[]
): GroupedAnalysis[] => {
  return useMemo(() => {
    console.log('Grouping analyses:', {
      individualCount: individualAnalyses.length,
      batchCount: batchAnalyses.length,
      uploadsCount: uploads.length
    });

    const groups: GroupedAnalysis[] = [];
    const processedIndividualAnalyses = new Set<string>();

    // Process batch analyses first (these are the primary groups)
    batchAnalyses.forEach(batchAnalysis => {
      const batchUploads = uploads.filter(u => u.batch_id === batchAnalysis.batch_id);
      const batchName = batchUploads[0]?.batch_name || `Batch ${batchAnalysis.batch_id.slice(0, 8)}`;
      
      // Find related individual analyses for this batch
      const relatedIndividualAnalyses = individualAnalyses.filter(analysis => {
        const upload = uploads.find(u => u.id === analysis.design_upload_id);
        return upload && upload.batch_id === batchAnalysis.batch_id;
      });

      // Mark these individual analyses as processed
      relatedIndividualAnalyses.forEach(analysis => {
        processedIndividualAnalyses.add(analysis.id);
      });

      // Create the primary batch analysis object
      const primaryAnalysis: Analysis = {
        id: batchAnalysis.id,
        type: 'batch',
        title: batchName,
        status: 'completed',
        created_at: batchAnalysis.created_at,
        confidence_score: batchAnalysis.confidence_score,
        analysis_type: batchAnalysis.analysis_type,
        upload_count: batchUploads.length,
        winner_upload_id: batchAnalysis.winner_upload_id,
        batch_name: batchName,
        rawData: batchAnalysis,
        relatedUploads: batchUploads
      };

      // Create related individual analysis objects
      const relatedAnalyses: Analysis[] = relatedIndividualAnalyses.map(analysis => {
        const upload = uploads.find(u => u.id === analysis.design_upload_id);
        return {
          id: analysis.id,
          type: 'individual',
          title: upload?.file_name || 'Chat Analysis',
          status: upload?.status || 'completed',
          created_at: analysis.created_at,
          confidence_score: analysis.confidence_score,
          analysis_type: analysis.analysis_type,
          upload_count: 1,
          winner_upload_id: null,
          batch_name: null,
          rawData: analysis,
          relatedUpload: upload
        };
      });

      groups.push({
        id: batchAnalysis.batch_id,
        groupTitle: batchName,
        groupType: 'batch',
        primaryAnalysis,
        relatedAnalyses,
        totalUploads: batchUploads.length,
        latestDate: batchAnalysis.created_at,
        overallConfidence: batchAnalysis.confidence_score
      });
    });

    // Process remaining individual analyses (not part of any batch)
    const standaloneIndividualAnalyses = individualAnalyses.filter(
      analysis => !processedIndividualAnalyses.has(analysis.id)
    );

    standaloneIndividualAnalyses.forEach(analysis => {
      const upload = uploads.find(u => u.id === analysis.design_upload_id);
      
      const primaryAnalysis: Analysis = {
        id: analysis.id,
        type: 'individual',
        title: upload?.file_name || 'Chat Analysis',
        status: upload?.status || 'completed',
        created_at: analysis.created_at,
        confidence_score: analysis.confidence_score,
        analysis_type: analysis.analysis_type,
        upload_count: 1,
        winner_upload_id: null,
        batch_name: null,
        rawData: analysis,
        relatedUpload: upload
      };

      groups.push({
        id: `individual-${analysis.id}`,
        groupTitle: upload?.file_name || 'Individual Analysis',
        groupType: 'individual',
        primaryAnalysis,
        relatedAnalyses: [],
        totalUploads: 1,
        latestDate: analysis.created_at,
        overallConfidence: analysis.confidence_score
      });
    });

    // Sort groups by latest date
    const sortedGroups = groups.sort((a, b) => 
      new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime()
    );

    console.log('Grouped analyses result:', {
      totalGroups: sortedGroups.length,
      batchGroups: sortedGroups.filter(g => g.groupType === 'batch').length,
      individualGroups: sortedGroups.filter(g => g.groupType === 'individual').length
    });

    return sortedGroups;
  }, [uploads, individualAnalyses, batchAnalyses]);
};
