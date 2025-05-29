import React, { useState, useEffect } from 'react';
import { StrategicDecision, DecisionOption, StrategicGameplayEngine } from '../game/StrategicGameplayEngine';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Clock, AlertTriangle, Zap, Users, Star } from 'lucide-react';

interface StrategicDecisionPanelProps {
  strategicEngine: StrategicGameplayEngine | null;
  isVisible: boolean;
  onDecisionMade: (decisionId: string, optionId: string) => void;
}

const StrategicDecisionPanel: React.FC<StrategicDecisionPanelProps> = ({
  strategicEngine,
  isVisible,
  onDecisionMade
}) => {
  const [activeDecisions, setActiveDecisions] = useState<StrategicDecision[]>([]);
  const [selectedDecision, setSelectedDecision] = useState<StrategicDecision | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (!strategicEngine || !isVisible) return;

    const updateDecisions = () => {
      const decisions = strategicEngine.getActiveDecisions();
      setActiveDecisions(decisions);
      
      // Initialize timers for time-limited decisions
      const timers: { [key: string]: number } = {};
      decisions.forEach(decision => {
        if (decision.timeLimit) {
          timers[decision.id] = decision.timeLimit;
        }
      });
      setTimeRemaining(timers);
    };

    updateDecisions();
    const interval = setInterval(updateDecisions, 1000);

    return () => clearInterval(interval);
  }, [strategicEngine, isVisible]);

  useEffect(() => {
    // Countdown timers
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(id => {
          if (updated[id] > 0) {
            updated[id] -= 1;
          } else {
            // Time's up - auto-select default option or cancel
            const decision = activeDecisions.find(d => d.id === id);
            if (decision && decision.options.length > 0) {
              onDecisionMade(id, decision.options[0].id); // Default to first option
            }
            delete updated[id];
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeDecisions, onDecisionMade]);

  if (!isVisible || !strategicEngine || activeDecisions.length === 0) {
    return null;
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getUrgencyColor = (urgency: string): string => {
    switch (urgency) {
      case 'critical': return 'text-red-400 border-red-400';
      case 'high': return 'text-orange-400 border-orange-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      default: return 'text-blue-400 border-blue-400';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'critical': return <AlertTriangle className="w-5 h-5" />;
      case 'high': return <Zap className="w-5 h-5" />;
      case 'medium': return <Clock className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const renderDecisionList = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-cyan-400 mb-4">Cosmic Decisions Await</h3>
      {activeDecisions.map(decision => (
        <Card 
          key={decision.id}
          className={`p-4 bg-gray-900/80 border-2 cursor-pointer transition-all hover:bg-gray-800/80 ${getUrgencyColor(decision.urgency)}`}
          onClick={() => setSelectedDecision(decision)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {getUrgencyIcon(decision.urgency)}
              <div>
                <h4 className="font-bold text-white">{decision.title}</h4>
                <p className="text-gray-300 text-sm mt-1">{decision.description}</p>
                <p className="text-gray-400 text-xs mt-2 italic">{decision.context}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-bold ${getUrgencyColor(decision.urgency)}`}>
                {decision.urgency.toUpperCase()}
              </div>
              {decision.timeLimit && timeRemaining[decision.id] && (
                <div className="text-red-400 font-mono text-sm mt-1">
                  {formatTime(timeRemaining[decision.id])}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderDecisionDetails = () => {
    if (!selectedDecision) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setSelectedDecision(null)}
            className="text-cyan-400 border-cyan-400 hover:bg-cyan-400/20"
          >
            ← Back to Decisions
          </Button>
          {selectedDecision.timeLimit && timeRemaining[selectedDecision.id] && (
            <div className="text-red-400 font-mono text-lg font-bold">
              Time: {formatTime(timeRemaining[selectedDecision.id])}
            </div>
          )}
        </div>

        <Card className="p-6 bg-gray-900/90 border-cyan-400/50">
          <div className="flex items-center gap-3 mb-4">
            {getUrgencyIcon(selectedDecision.urgency)}
            <h3 className="text-2xl font-bold text-white">{selectedDecision.title}</h3>
          </div>
          
          <p className="text-gray-300 mb-4">{selectedDecision.description}</p>
          <p className="text-gray-400 text-sm mb-6 italic bg-gray-800/50 p-3 rounded">
            Context: {selectedDecision.context}
          </p>

          <div className="mb-6">
            <h4 className="text-lg font-bold text-cyan-400 mb-2">Scientific Basis</h4>
            <p className="text-gray-300 text-sm">{selectedDecision.scientificBasis}</p>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-bold text-green-400 mb-2">Real-World Example</h4>
            <p className="text-gray-300 text-sm">{selectedDecision.realWorldExample}</p>
          </div>
        </Card>

        <div className="space-y-4">
          <h4 className="text-xl font-bold text-yellow-400">Choose Your Response:</h4>
          {selectedDecision.options.map(option => (
            <Card 
              key={option.id}
              className="p-4 bg-gray-800/60 border border-gray-600 hover:border-yellow-400/50 transition-all cursor-pointer hover:bg-gray-700/60"
              onClick={() => {
                onDecisionMade(selectedDecision.id, option.id);
                setSelectedDecision(null);
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <h5 className="font-bold text-white text-lg">{option.name}</h5>
                <div className="text-right text-sm">
                  <div className="text-purple-400">Difficulty: {option.difficultyLevel}/10</div>
                  <div className="text-orange-400">Moral Weight: {option.moralWeight}/10</div>
                  <div className="text-cyan-400">Strategic Value: {option.strategicValue}/10</div>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{option.description}</p>
              
              <div className="space-y-3">
                <div>
                  <h6 className="text-green-400 font-semibold">Immediate Effects:</h6>
                  <ul className="text-sm text-gray-300 ml-4">
                    {option.immediateEffects.map((effect, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className={effect.type === 'gain' ? 'text-green-400' : 'text-red-400'}>
                          {effect.type === 'gain' ? '+' : '-'}
                        </span>
                        <span>{effect.amount} {effect.resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h6 className="text-blue-400 font-semibold">Long-term Consequences:</h6>
                  <ul className="text-sm text-gray-300 ml-4">
                    {option.longTermEffects.map((effect, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-blue-400">•</span>
                        <span>{effect.effect} (Probability: {(effect.probability * 100).toFixed(0)}%)</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {Object.keys(option.requiredResources).length > 0 && (
                  <div>
                    <h6 className="text-red-400 font-semibold">Resource Requirements:</h6>
                    <ul className="text-sm text-gray-300 ml-4">
                      {Object.entries(option.requiredResources).map(([resource, amount]) => (
                        <li key={resource} className="flex items-center gap-2">
                          <span className="text-red-400">•</span>
                          <span>{amount} {resource}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-gray-900/95 border-2 border-cyan-400 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl font-bold text-cyan-400">Strategic Command Center</h2>
          </div>
          <div className="text-sm text-gray-400">
            Decisions shape the cosmos permanently
          </div>
        </div>

        {selectedDecision ? renderDecisionDetails() : renderDecisionList()}
      </div>
    </div>
  );
};

export default StrategicDecisionPanel;