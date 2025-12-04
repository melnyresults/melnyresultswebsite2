import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, DollarSign, Phone, Mail, MapPin, Tag, User, FileText } from 'lucide-react';
import { usePipelines } from '../hooks/usePipelines';
import { useOpportunities } from '../hooks/useOpportunities';
import CreatePipelineModal from './CreatePipelineModal';
import CreateOpportunityModal from './CreateOpportunityModal';
import EditPipelineModal from './EditPipelineModal';
import EditOpportunityModal from './EditOpportunityModal';

const OpportunitiesView: React.FC = () => {
  const { pipelines, stages, loading: pipelinesLoading, refetchStages, deletePipeline } = usePipelines();
  const [selectedPipeline, setSelectedPipeline] = useState<string>('');
  const { opportunities, loading: oppsLoading } = useOpportunities(selectedPipeline);
  const [showCreatePipeline, setShowCreatePipeline] = useState(false);
  const [showEditPipeline, setShowEditPipeline] = useState(false);
  const [showCreateOpportunity, setShowCreateOpportunity] = useState(false);
  const [showEditOpportunity, setShowEditOpportunity] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [opportunityToEdit, setOpportunityToEdit] = useState<any>(null);

  useEffect(() => {
    if (pipelines.length > 0 && !selectedPipeline) {
      setSelectedPipeline(pipelines[0].id);
    }
  }, [pipelines]);

  useEffect(() => {
    if (selectedPipeline) {
      refetchStages(selectedPipeline);
    }
  }, [selectedPipeline]);

  const pipelineStages = stages.filter(stage => stage.pipeline_id === selectedPipeline);

  const getOpportunitiesByStage = (stageId: string) => {
    return opportunities.filter(opp => opp.stage_id === stageId && opp.status === 'open');
  };

  const calculateStageValue = (stageId: string) => {
    return getOpportunitiesByStage(stageId).reduce((sum, opp) => sum + Number(opp.value), 0);
  };

  const handleDeletePipeline = async () => {
    if (!selectedPipeline) return;

    const { error } = await deletePipeline(selectedPipeline);
    if (!error) {
      setShowDeleteConfirm(false);
      if (pipelines.length > 1) {
        const remainingPipelines = pipelines.filter(p => p.id !== selectedPipeline);
        setSelectedPipeline(remainingPipelines[0]?.id || '');
      } else {
        setSelectedPipeline('');
      }
    }
  };

  const currentPipeline = pipelines.find(p => p.id === selectedPipeline);

  if (pipelinesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pipelines...</p>
        </div>
      </div>
    );
  }

  if (pipelines.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pipelines yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first sales pipeline.</p>
          <button
            onClick={() => setShowCreatePipeline(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Pipeline
          </button>
        </div>
        {showCreatePipeline && (
          <CreatePipelineModal onClose={() => setShowCreatePipeline(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
            <div className="flex items-center space-x-2">
              <select
                value={selectedPipeline}
                onChange={(e) => setSelectedPipeline(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              >
                {pipelines.map(pipeline => (
                  <option key={pipeline.id} value={pipeline.id}>{pipeline.name}</option>
                ))}
              </select>
              {selectedPipeline && (
                <>
                  <button
                    onClick={() => setShowEditPipeline(true)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit pipeline"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete pipeline"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreateOpportunity(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Opportunity
            </button>
            <button
              onClick={() => setShowCreatePipeline(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Pipeline
            </button>
          </div>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="flex-1 overflow-x-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex space-x-6 h-full min-h-[600px]">
          {pipelineStages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center bg-white p-8 rounded-xl shadow-sm">
                <p className="text-gray-600">No stages in this pipeline. Create one to get started.</p>
              </div>
            </div>
          ) : (
            pipelineStages.map((stage) => {
              const stageOpportunities = getOpportunitiesByStage(stage.id);
              const stageValue = calculateStageValue(stage.id);

              return (
                <div key={stage.id} className="flex-shrink-0 w-80">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-full flex flex-col">
                    {/* Stage Header with Color Bar */}
                    <div className="mb-4">
                      <div
                        className="h-1 w-full rounded-full mb-3 shadow-sm"
                        style={{ backgroundColor: stage.color }}
                      />
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">{stage.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white shadow-sm"
                            style={{ backgroundColor: stage.color }}
                          >
                            {stageOpportunities.length}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="text-lg font-bold text-gray-900">
                          ${stageValue.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Opportunities */}
                    <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                      {stageOpportunities.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">
                          No opportunities in this stage
                        </div>
                      ) : (
                        stageOpportunities.map((opp) => (
                          <div
                            key={opp.id}
                            onClick={() => setSelectedOpportunity(opp)}
                            className="bg-white p-4 rounded-lg border-2 border-gray-100 hover:border-primary-blue cursor-pointer transition-all hover:shadow-md group"
                            style={{
                              borderLeftWidth: '4px',
                              borderLeftColor: stage.color,
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 text-sm group-hover:text-primary-blue transition-colors">
                                {opp.lead_name}
                              </h4>
                              <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                                ${Number(opp.value).toLocaleString()}
                              </span>
                            </div>
                            {opp.business_name && (
                              <p className="text-xs text-gray-600 mb-3 font-medium">{opp.business_name}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              {opp.city && (
                                <span className="flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {opp.city}
                                </span>
                              )}
                              {opp.source && (
                                <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md font-medium">
                                  {opp.source}
                                </span>
                              )}
                              {opp.tags && opp.tags.length > 0 && (
                                <span className="flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md">
                                  <Tag className="w-3 h-3 mr-1" />
                                  {opp.tags[0]}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreatePipeline && (
        <CreatePipelineModal onClose={() => setShowCreatePipeline(false)} />
      )}
      {showEditPipeline && currentPipeline && (
        <EditPipelineModal
          pipeline={currentPipeline}
          pipelineStages={pipelineStages}
          onClose={() => setShowEditPipeline(false)}
        />
      )}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          pipelineName={currentPipeline?.name || ''}
          onConfirm={handleDeletePipeline}
          onClose={() => setShowDeleteConfirm(false)}
        />
      )}
      {showCreateOpportunity && (
        <CreateOpportunityModal
          pipelineId={selectedPipeline}
          onClose={() => setShowCreateOpportunity(false)}
        />
      )}
      {showEditOpportunity && opportunityToEdit && (
        <EditOpportunityModal
          opportunity={opportunityToEdit}
          pipelineId={selectedPipeline}
          onClose={() => {
            setShowEditOpportunity(false);
            setOpportunityToEdit(null);
          }}
        />
      )}
      {selectedOpportunity && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
          onEdit={(opp) => {
            setOpportunityToEdit(opp);
            setShowEditOpportunity(true);
            setSelectedOpportunity(null);
          }}
        />
      )}
    </div>
  );
};

const DeleteConfirmModal: React.FC<{
  pipelineName: string;
  onConfirm: () => void;
  onClose: () => void;
}> = ({ pipelineName, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Pipeline</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <span className="font-semibold">{pipelineName}</span>? This action cannot be undone and will delete all associated stages and opportunities.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Pipeline
          </button>
        </div>
      </div>
    </div>
  );
};

const OpportunityDetailModal: React.FC<{
  opportunity: any;
  onClose: () => void;
  onEdit: (opp: any) => void;
}> = ({
  opportunity,
  onClose,
  onEdit,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{opportunity.lead_name}</h2>
              {opportunity.business_name && (
                <p className="text-lg text-gray-600 font-medium">{opportunity.business_name}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-5">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Deal Value</p>
                  <span className="font-bold text-2xl text-green-700">
                    ${Number(opportunity.value).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opportunity.email && (
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 font-medium mb-1">Email</p>
                    <a href={`mailto:${opportunity.email}`} className="text-primary-blue hover:underline text-sm font-medium truncate block">
                      {opportunity.email}
                    </a>
                  </div>
                </div>
              )}

              {opportunity.phone_number && (
                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Phone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 font-medium mb-1">Phone</p>
                    <a href={`tel:${opportunity.phone_number}`} className="text-primary-blue hover:underline text-sm font-medium truncate block">
                      {opportunity.phone_number}
                    </a>
                  </div>
                </div>
              )}

              {(opportunity.city || opportunity.location) && (
                <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 font-medium mb-1">Location</p>
                    <span className="text-gray-700 text-sm font-medium">
                      {[opportunity.city, opportunity.location].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </div>
              )}

              {opportunity.source && (
                <div className="flex items-center space-x-3 p-4 bg-pink-50 rounded-lg border border-pink-100">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Tag className="w-5 h-5 text-pink-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 font-medium mb-1">Source</p>
                    <span className="text-gray-700 text-sm font-medium">{opportunity.source}</span>
                  </div>
                </div>
              )}

              {opportunity.source_owner && (
                <div className="flex items-center space-x-3 p-4 bg-teal-50 rounded-lg border border-teal-100 col-span-full">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <User className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 font-medium mb-1">Opportunity Owner</p>
                    <span className="text-gray-700 text-sm font-medium">{opportunity.source_owner}</span>
                  </div>
                </div>
              )}
            </div>

            {opportunity.tags && opportunity.tags.length > 0 && (
              <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Tag className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900 font-bold">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {opportunity.tags.map((tag: string, index: number) => (
                    <span key={index} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {opportunity.notes && (
              <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900 font-bold">Notes</span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {opportunity.notes}
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold hover:shadow-sm"
            >
              Close
            </button>
            <button
              onClick={() => onEdit(opportunity)}
              className="px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Opportunity</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesView;
