import Dexie from 'dexie';

export const appDB = new Dexie('AppDB');
appDB.version(1).stores({
  applications: '++id, &ref_id, title, status, company, post_url, location, income, *benefits, *requirements, date, score, *status_history',
  titles: '&id, app_arr',
  companies: '&id, app_arr',
  benefits: '&id, app_arr',
  requirements: '&id, app_arr',
  status: '&id, app_arr',
});

export const scoreDB = new Dexie('ScoreDB');
scoreDB.version(1).stores({
  titles: '&id, rank',
  companies: '&id, rank',
  benefits: '&id, rank',
  income: '&id, min',
});

export const researchDB = new Dexie('ResearchDB');
researchDB.version(1).stores({
  frequencies: '&id, *frequency',
  associations: '&id, is_associated, table',
});