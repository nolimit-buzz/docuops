export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/users/login',
    REGISTER: '/users/register',
  },
  HISTORY: '/history',
  USERS: {
    ALL: '/users/all',
  },
  DOCUMENTS: {
    DELETE: (id: string, type: string) => `/documents/${type}/${id}`,
    UPDATE: (id: string, type: string) => `/documents/${type}/${id}`,
  },
  MARKET_REPORTS: {
    CREATE: '/market-reports/create',
    GET: (id: string) => `/market-reports/${id}`,
    UPDATE: (id: string) => `/market-reports/${id}`,
    DELETE: (id: string) => `/market-reports/${id}`,
    SUBMIT: (id: string) => `/market-reports/${id}/submit`,
    UPDATE_SECTION: (id: string, key: string) => `/market-reports/${id}/sections/${key}`,
    UPDATE_SUBSECTION: (id: string, sectionKey: string, subsectionKey: string) => 
      `/market-reports/${id}/sections/${sectionKey}/subsections/${subsectionKey}`,
    REGENERATE: (id: string) => `/market-reports/${id}/regenerate/`,
    REGENERATE_SUBSECTION: (id: string) => `/market-reports/${id}/regenerateSubsection`,
  },
  NBC_PAPERS: {
    CREATE: '/nbc-papers/create',
    GET: (id: string) => `/nbc-papers/${id}`,
    UPDATE: (id: string) => `/nbc-papers/${id}`,
    DELETE: (id: string) => `/nbc-papers/${id}`,
    SUBMIT: (id: string) => `/nbc-papers/${id}/submit`,
    UPDATE_SECTION: (id: string, key: string) => `/nbc-papers/${id}/sections/${key}`,
    UPDATE_SUBSECTION: (id: string, sectionKey: string, subsectionKey: string) => 
      `/nbc-papers/${id}/sections/${sectionKey}/subsections/${subsectionKey}`,
    REGENERATE: (id: string) => `/nbc-papers/${id}/regenerate`,
    REGENERATE_SUBSECTION: (id: string) => `/nbc-papers/${id}/regenerateSubsection`,
  },
};
