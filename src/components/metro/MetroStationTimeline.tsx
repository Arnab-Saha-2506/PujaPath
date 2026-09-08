import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MetroStationResponseDTO } from '../../types/api';
import { getMetroLineMeta, parseStationLines } from '../../utils/metroColors';
import { Search, Train, ArrowRight, Shuffle } from 'lucide-react';

interface MetroStationTimelineProps {
  lineName: string;
  stations: MetroStationResponseDTO[];
}

export const MetroStationTimeline: React.FC<MetroStationTimelineProps> = ({
  lineName,
  stations,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const meta = getMetroLineMeta(lineName);

  const filteredStations = stations.filter((station) =>
    station.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="bg-ivory-surface rounded-2xl border border-ivory-border p-4 sm:p-6 shadow-warm-sm">
      {/* Filter Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-charcoal-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search stations along ${lineName}...`}
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-ivory-warm border border-ivory-border rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion transition-all placeholder:text-charcoal-subtle"
          />
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-6">
        {/* Continuous Vertical Rail */}
        <div
          className="absolute left-2.5 sm:left-3.5 top-3 bottom-6 w-1 rounded-full"
          style={{ backgroundColor: meta.hex }}
        />

        {filteredStations.length === 0 ? (
          <div className="text-center py-8 text-sm text-charcoal-muted">
            No stations match your search "{filterQuery}".
          </div>
        ) : (
          filteredStations.map((station, index) => {
            const allLines = parseStationLines(station.line);
            const isInterchange = allLines.length > 1;
            const isFirst = index === 0;
            const isLast = index === filteredStations.length - 1;

            return (
              <div key={station.id} className="relative group">
                {/* Timeline Station Dot */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-3.5 w-6 h-6 rounded-full flex items-center justify-center border-3 transition-transform group-hover:scale-125 bg-ivory-surface shadow-xs z-10`}
                  style={{
                    borderColor: meta.hex,
                  }}
                >
                  {isInterchange ? (
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: meta.hex }}
                    />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-charcoal-soft" />
                  )}
                </div>

                {/* Station Card */}
                <div className="bg-ivory-warm/70 hover:bg-ivory-surface border border-ivory-border hover:border-terracotta/40 rounded-xl p-3.5 sm:p-4 transition-all duration-200 shadow-xs hover:shadow-warm-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="text-xs text-charcoal-subtle font-mono">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                      <h4 className="text-base font-bold text-charcoal group-hover:text-vermilion transition-colors">
                        {station.name}
                      </h4>
                      {/* Accurate Terminal Badges based on genuine terminal stations */}
                      {!filterQuery.trim() && (
                        <>
                          {((lineName.toLowerCase().includes('green') && station.name.toLowerCase().includes('howrah maidan')) ||
                            (lineName.toLowerCase().includes('blue') && station.name.toLowerCase().includes('dakshineswar')) ||
                            (lineName.toLowerCase().includes('purple') && station.name.toLowerCase().includes('joka')) ||
                            (lineName.toLowerCase().includes('orange') && index === 0) ||
                            (lineName.toLowerCase().includes('yellow') && (station.name.toLowerCase().includes('noapara') || index === 0))) && (
                              <span className="text-[10px] font-semibold bg-stone-200 text-charcoal px-2 py-0.5 rounded-full border border-stone-300">
                                Origin / Terminal
                              </span>
                            )}
                          {((lineName.toLowerCase().includes('green') && station.name.toLowerCase().includes('sector v')) ||
                            (lineName.toLowerCase().includes('blue') && station.name.toLowerCase().includes('kavi subhash')) ||
                            (lineName.toLowerCase().includes('purple') && station.name.toLowerCase().includes('majerhat')) ||
                            (lineName.toLowerCase().includes('orange') && index === stations.length - 1) ||
                            (lineName.toLowerCase().includes('yellow') && (station.name.toLowerCase().includes('jai hind') || index === stations.length - 1))) && (
                              <span className="text-[10px] font-semibold bg-stone-200 text-charcoal px-2 py-0.5 rounded-full border border-stone-300">
                                Terminal
                              </span>
                            )}
                        </>
                      )}
                    </div>

                    {/* Interchanges if applicable */}
                    {isInterchange && (
                      <div className="flex items-center space-x-1.5 pt-0.5">
                        <Shuffle className="w-3 h-3 text-terracotta" />
                        <span className="text-[11px] font-medium text-terracotta">
                          Interchange:
                        </span>
                        <div className="flex items-center space-x-1">
                          {allLines.map((l) => {
                            const lMeta = getMetroLineMeta(l);
                            return (
                              <span
                                key={l}
                                className="text-[10px] text-white px-2 py-0.5 rounded-full font-semibold shadow-xs"
                                style={{ backgroundColor: lMeta.hex }}
                              >
                                {l}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action link to view pandals */}
                  <Link
                    to={`/metro/stations/${station.id}`}
                    className="shrink-0 inline-flex items-center space-x-1.5 text-xs font-semibold text-vermilion bg-vermilion/5 hover:bg-vermilion/10 px-3 py-1.5 rounded-lg border border-vermilion/15 transition-all self-start sm:self-center"
                  >
                    <Train className="w-3.5 h-3.5 text-vermilion" />
                    <span>View Nearby Pandals</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

