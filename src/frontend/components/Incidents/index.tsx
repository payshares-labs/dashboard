import React, { useCallback, useEffect, useState } from "react";
import { TextLink, Table } from "@stellar/design-system";
import moment from "moment";

import {
  STATUSPAGE_URL,
  STATUS_INCIDENTS_URL,
} from "frontend/constants/settings";
import { SectionCard } from "frontend/components/SectionCard";

import { Incident, IncidentItem } from "types";

import "./styles.scss";

// TODO: do we need to fetch every minute?
const FETCH_INTERVAL = 60 * 1000;

export const Incidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const cleanIncidents = (items: IncidentItem[]) =>
    items.map((i) => ({
      id: i.id,
      name: i.name,
      startedAt: i.started_at,
    }));

  const fetchIncidents = useCallback(async () => {
    // TODO: limit is not working
    const fetchResponse = await fetch(
      `${STATUSPAGE_URL}/incidents.json?limit=10`,
    );
    const incidentsData = await fetchResponse.json();

    setIncidents(cleanIncidents(incidentsData.incidents));
  }, []);

  useEffect(() => {
    fetchIncidents();

    const interval = setInterval(() => {
      fetchIncidents();
    }, FETCH_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [fetchIncidents]);

  return (
    <SectionCard title="Incidents">
      <div className="Incidents">
        <Table
          columnLabels={[
            {
              id: "description",
              label: "Description",
            },
            {
              id: "time",
              label: "Time ago",
            },
          ]}
          data={incidents}
          hideNumberColumn
          renderItemRow={(i) => (
            <React.Fragment key={i.id}>
              <td>
                <TextLink href={`${STATUS_INCIDENTS_URL}/${i.id}`}>
                  {i.name}
                </TextLink>
              </td>
              <td className="Incidents__timeAgo">
                ({moment(i.startedAt).fromNow()})
              </td>
            </React.Fragment>
          )}
        />
      </div>
    </SectionCard>
  );
};
