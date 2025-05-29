import React, { useState, useEffect } from 'react';
import './SpaceExplorationUI.css';
import { SpaceScanner, ScanResult, ThreatLevel } from '../game/SpaceScanner';
import { AtmosphericEntry, EntryPhase, EntryData } from '../game/AtmosphericEntry';
import { SpaceNavigator, NavigationTarget, SpaceEnvironment, MissionType } from '../game/SpaceNavigator';

interface SpaceExplorationUIProps {
  scanner: SpaceScanner;
  atmosphericEntry: AtmosphericEntry;
  navigator: SpaceNavigator;
  isVisible: boolean;
}

const SpaceExplorationUI: React.FC<SpaceExplorationUIProps> = ({
  scanner,
  atmosphericEntry,
  navigator,
  isVisible
}) => {
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [entryData, setEntryData] = useState<EntryData | null>(null);
  const [environment, setEnvironment] = useState<SpaceEnvironment | null>(null);
  const [targets, setTargets] = useState<NavigationTarget[]>([]);
  const [activeTab, setActiveTab] = useState<'scanner' | 'entry' | 'navigation'>('scanner');
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    if (!isVisible) return;

    // Set up scanner callbacks
    scanner.setCallbacks(
      (result) => {
        setScanResult(result);
        setScanProgress(0);
      },
      (progress) => setScanProgress(progress)
    );

    // Set up atmospheric entry callbacks
    atmosphericEntry.setCallbacks(
      (phase) => {
        setAlerts(prev => [...prev, `Entry Phase: ${phase}`]);
      },
      () => {
        setAlerts(prev => [...prev, 'Atmospheric entry completed successfully']);
      },
      () => {
        setAlerts(prev => [...prev, 'CRITICAL: Heat shield failure imminent!']);
      }
    );

    // Set up navigator callbacks
    navigator.setCallbacks(
      (target) => {
        setAlerts(prev => [...prev, `Target reached: ${target.object.name || 'Unknown Object'}`]);
      },
      (env) => setEnvironment(env),
      (hazard) => {
        setAlerts(prev => [...prev, `⚠ ${hazard}`]);
      }
    );

    // Update entry data periodically
    const interval = setInterval(() => {
      setEntryData(atmosphericEntry.getEntryData());
      setTargets(navigator.getTargets());
      setEnvironment(navigator.getEnvironment());
    }, 100);

    return () => clearInterval(interval);
  }, [isVisible, scanner, atmosphericEntry, navigator]);

  if (!isVisible) return null;

  const renderScannerTab = () => (
    <div className="space-panel">
      <h3 className="panel-title">Deep Space Scanner</h3>
      
      {scanProgress > 0 && (
        <div className="scan-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${scanProgress * 100}%` }}
            />
          </div>
          <span>Scanning... {Math.round(scanProgress * 100)}%</span>
        </div>
      )}

      {scanResult && (
        <div className="scan-results">
          <h4>Scan Results: {scanResult.name}</h4>
          <div className="result-grid">
            <div className="result-item">
              <span className="label">Type:</span>
              <span className="value">{scanResult.objectType}</span>
            </div>
            <div className="result-item">
              <span className="label">Distance:</span>
              <span className="value">{scanResult.distance.toFixed(1)} units</span>
            </div>
            <div className="result-item">
              <span className="label">Mass:</span>
              <span className="value">{scanResult.mass.toFixed(2)} Earth masses</span>
            </div>
            <div className="result-item">
              <span className="label">Temperature:</span>
              <span className="value">{Math.round(scanResult.temperature)} K</span>
            </div>
            <div className="result-item">
              <span className="label">Threat Level:</span>
              <span className={`value threat-${scanResult.threat.toLowerCase().replace(' ', '-')}`}>
                {scanResult.threat}
              </span>
            </div>
            <div className="result-item">
              <span className="label">Habitability:</span>
              <span className="value">{Math.round(scanResult.habitability * 100)}%</span>
            </div>
          </div>

          {scanResult.composition.length > 0 && (
            <div className="composition">
              <h5>Composition:</h5>
              <div className="composition-tags">
                {scanResult.composition.map((element, index) => (
                  <span key={index} className="composition-tag">{element}</span>
                ))}
              </div>
            </div>
          )}

          {scanResult.atmosphere && (
            <div className="atmosphere-data">
              <h5>Atmospheric Data:</h5>
              <div className="atmosphere-grid">
                <div>Pressure: {scanResult.atmosphere.pressure.toFixed(2)} atm</div>
                <div>Wind Speed: {Math.round(scanResult.atmosphere.windSpeed)} km/h</div>
                <div>Entry Difficulty: {scanResult.atmosphere.entryDifficulty}</div>
              </div>
            </div>
          )}

          {scanResult.lifeSignatures.length > 0 && (
            <div className="life-signatures">
              <h5>Life Signatures Detected:</h5>
              <ul>
                {scanResult.lifeSignatures.map((signature, index) => (
                  <li key={index} className="life-signature">{signature}</li>
                ))}
              </ul>
            </div>
          )}

          {scanResult.mineralDeposits.length > 0 && (
            <div className="mineral-deposits">
              <h5>Mineral Deposits:</h5>
              <div className="mineral-tags">
                {scanResult.mineralDeposits.map((mineral, index) => (
                  <span key={index} className="mineral-tag">{mineral}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderEntryTab = () => (
    <div className="space-panel">
      <h3 className="panel-title">Atmospheric Entry</h3>
      
      {entryData ? (
        <div className="entry-telemetry">
          <div className="entry-phase">
            <h4>Current Phase: {entryData.entryPhase}</h4>
          </div>
          
          <div className="telemetry-grid">
            <div className="telemetry-item">
              <span className="label">Altitude:</span>
              <span className="value">{Math.round(entryData.altitude).toLocaleString()} m</span>
            </div>
            <div className="telemetry-item">
              <span className="label">Velocity:</span>
              <span className="value">{Math.round(entryData.velocity)} m/s</span>
            </div>
            <div className="telemetry-item">
              <span className="label">Temperature:</span>
              <span className={`value ${entryData.temperature > 2000 ? 'critical' : ''}`}>
                {Math.round(entryData.temperature)} K
              </span>
            </div>
            <div className="telemetry-item">
              <span className="label">G-Forces:</span>
              <span className={`value ${entryData.gForces > 15 ? 'critical' : ''}`}>
                {entryData.gForces.toFixed(1)} g
              </span>
            </div>
            <div className="telemetry-item">
              <span className="label">Heat Shield:</span>
              <span className={`value ${entryData.heatShield < 30 ? 'critical' : ''}`}>
                {Math.round(entryData.heatShield)}%
              </span>
            </div>
            <div className="telemetry-item">
              <span className="label">Hull Integrity:</span>
              <span className={`value ${entryData.structuralIntegrity < 50 ? 'critical' : ''}`}>
                {Math.round(entryData.structuralIntegrity)}%
              </span>
            </div>
          </div>

          <div className="entry-progress">
            <h5>Entry Progress:</h5>
            <div className="phase-indicator">
              {Object.values(EntryPhase).map((phase, index) => (
                <div 
                  key={phase}
                  className={`phase-step ${entryData.entryPhase === phase ? 'active' : ''}`}
                >
                  {phase}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="no-entry">
          <p>No atmospheric entry in progress</p>
          <p>Approach a planet to begin entry sequence</p>
        </div>
      )}
    </div>
  );

  const renderNavigationTab = () => (
    <div className="space-panel">
      <h3 className="panel-title">Space Navigation</h3>
      
      {environment && (
        <div className="environment-status">
          <h4>Environmental Conditions</h4>
          <div className="env-grid">
            <div className="env-item">
              <span className="label">Radiation:</span>
              <span className={`value ${environment.radiation > 2 ? 'warning' : ''}`}>
                {environment.radiation.toFixed(2)} units
              </span>
            </div>
            <div className="env-item">
              <span className="label">Gravity:</span>
              <span className="value">{environment.gravity.toFixed(2)} g</span>
            </div>
            <div className="env-item">
              <span className="label">Temperature:</span>
              <span className="value">{environment.temperature.toFixed(1)} K</span>
            </div>
            <div className="env-item">
              <span className="label">Magnetic Field:</span>
              <span className="value">{environment.magneticField.toFixed(2)} T</span>
            </div>
            <div className="env-item">
              <span className="label">Debris Objects:</span>
              <span className={`value ${environment.debris.length > 10 ? 'warning' : ''}`}>
                {environment.debris.length}
              </span>
            </div>
            <div className="env-item">
              <span className="label">Solar Wind:</span>
              <span className="value">{environment.solarWind.toFixed(2)} units</span>
            </div>
          </div>
        </div>
      )}

      {targets.length > 0 && (
        <div className="navigation-targets">
          <h4>Navigation Targets</h4>
          <div className="targets-list">
            {targets.map((target, index) => (
              <div key={index} className="target-item">
                <div className="target-info">
                  <span className="target-name">
                    {target.object.name || `Object ${index + 1}`}
                  </span>
                  <span className="target-distance">
                    {target.distance.toFixed(1)} units
                  </span>
                </div>
                <div className="target-mission">
                  Mission: {target.missionType}
                </div>
                <div className="target-eta">
                  ETA: {Math.round(target.estimatedTravelTime)}s
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-exploration-ui">
      <div className="ui-header">
        <h2>Space Exploration Console</h2>
        <div className="tab-navigation">
          <button 
            className={activeTab === 'scanner' ? 'active' : ''}
            onClick={() => setActiveTab('scanner')}
          >
            Scanner
          </button>
          <button 
            className={activeTab === 'entry' ? 'active' : ''}
            onClick={() => setActiveTab('entry')}
          >
            Entry
          </button>
          <button 
            className={activeTab === 'navigation' ? 'active' : ''}
            onClick={() => setActiveTab('navigation')}
          >
            Navigation
          </button>
        </div>
      </div>

      <div className="ui-content">
        {activeTab === 'scanner' && renderScannerTab()}
        {activeTab === 'entry' && renderEntryTab()}
        {activeTab === 'navigation' && renderNavigationTab()}
      </div>

      {alerts.length > 0 && (
        <div className="alerts-panel">
          <h4>Mission Alerts</h4>
          <div className="alerts-list">
            {alerts.slice(-5).map((alert, index) => (
              <div key={index} className="alert-item">
                {alert}
              </div>
            ))}
          </div>
          <button 
            className="clear-alerts"
            onClick={() => setAlerts([])}
          >
            Clear Alerts
          </button>
        </div>
      )}


    </div>
  );
};

export default SpaceExplorationUI;