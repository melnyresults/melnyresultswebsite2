import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type Pipeline = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type PipelineStage = {
  id: string;
  pipeline_id: string;
  name: string;
  stage_order: number;
  color: string;
  created_at: string;
  updated_at: string;
};

export const usePipelines = () => {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPipelines = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pipelines')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPipelines(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchStages = async (pipelineId?: string) => {
    try {
      let query = supabase
        .from('pipeline_stages')
        .select('*')
        .order('stage_order', { ascending: true });

      if (pipelineId) {
        query = query.eq('pipeline_id', pipelineId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setStages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    fetchPipelines();
    fetchStages();
  }, []);

  const createPipeline = async (pipelineData: Omit<Pipeline, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('You must be logged in to create a pipeline');
      }

      const { data, error } = await supabase
        .from('pipelines')
        .insert([{ ...pipelineData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      await fetchPipelines();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updatePipeline = async (id: string, pipelineData: Partial<Pipeline>) => {
    try {
      const { data, error } = await supabase
        .from('pipelines')
        .update(pipelineData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchPipelines();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const deletePipeline = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pipelines')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPipelines();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const createStage = async (stageData: Omit<PipelineStage, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('pipeline_stages')
        .insert([stageData])
        .select()
        .single();

      if (error) throw error;
      await fetchStages();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updateStage = async (id: string, stageData: Partial<PipelineStage>) => {
    try {
      const { data, error } = await supabase
        .from('pipeline_stages')
        .update(stageData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchStages();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const deleteStage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pipeline_stages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchStages();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  return {
    pipelines,
    stages,
    loading,
    error,
    createPipeline,
    updatePipeline,
    deletePipeline,
    createStage,
    updateStage,
    deleteStage,
    refetchPipelines: fetchPipelines,
    refetchStages: fetchStages,
  };
};
