import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { usePipelines } from '../hooks/usePipelines';

const CreatePipelineModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { createPipeline, createStage } = usePipelines();
  const [pipelineName, setPipelineName] = useState('');
  const [pipelineDescription, setPipelineDescription] = useState('');
  const [stages, setStages] = useState([
    { name: 'Prospecting', color: '#3B82F6' },
    { name: 'Qualified', color: '#8B5CF6' },
    { name: 'Proposal', color: '#F59E0B' },
    { name: 'Negotiation', color: '#EF4444' },
    { name: 'Closed Won', color: '#10B981' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addStage = () => {
    setStages([...stages, { name: '', color: '#3B82F6' }]);
  };

  const removeStage = (index: number) => {
    setStages(stages.filter((_, i) => i !== index));
  };

  const updateStage = (index: number, field: 'name' | 'color', value: string) => {
    const newStages = [...stages];
    newStages[index][field] = value;
    setStages(newStages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!pipelineName.trim()) {
      setError('Pipeline name is required');
      setLoading(false);
      return;
    }

    if (stages.some(s => !s.name.trim())) {
      setError('All stage names are required');
      setLoading(false);
      return;
    }

    try {
      const { data: pipeline, error: pipelineError } = await createPipeline({
        name: pipelineName,
        description: pipelineDescription,
      });

      if (pipelineError || !pipeline) {
        throw new Error(pipelineError || 'Failed to create pipeline');
      }

      for (let i = 0; i < stages.length; i++) {
        const { error: stageError } = await createStage({
          pipeline_id: pipeline.id,
          name: stages[i].name,
          order: i,
          color: stages[i].color,
        });

        if (stageError) {
          throw new Error(stageError);
        }
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Pipeline</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Pipeline Name
              </label>
              <input
                type="text"
                id="name"
                value={pipelineName}
                onChange={(e) => setPipelineName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                placeholder="e.g., Sales Pipeline"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={pipelineDescription}
                onChange={(e) => setPipelineDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                placeholder="Describe this pipeline..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">Pipeline Stages</label>
                <button
                  type="button"
                  onClick={addStage}
                  className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Stage
                </button>
              </div>

              <div className="space-y-3">
                {stages.map((stage, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={stage.name}
                      onChange={(e) => updateStage(index, 'name', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      placeholder="Stage name"
                    />
                    <input
                      type="color"
                      value={stage.color}
                      onChange={(e) => updateStage(index, 'color', e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    {stages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStage(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Pipeline'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePipelineModal;
