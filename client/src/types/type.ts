/* eslint-disable @typescript-eslint/no-unused-vars */

interface leadTypeType {
  name: string;
  id: number;
}

interface leadSourcesType {
  name: string;
  id: number;
}

interface leadStatusType {
  name: string;
  id: number;
}

interface contactHistoryLeadType {
  contact_date: string;
  description: string;
  file: {
    fileName: string;
    fileUrl: string;
  };
}

interface leadType {
  id: number | null;
  phone: string | null;
  companyName: string | null;
  fullName: string | null;
  phoneNumber: string | null;
  email: string | null;
  leadSource: {
    name: string | null;
  };
  leadType: {
    name: string | null;
  };
  user: {
    fullName: string | null;
  };
  leadStatus: {
    name: string | null;
  };
  position: string | null;
  companyWebsite: string | null;
  companyAddress: string | null;
  country: string | null;
  leadSourceId: string | null;
  contactChannelId: string | null;
  leadStatusId: string | null;
  assignedUserId: string | null;
  leadTypeId: string | null;
  note: string | null;
  lastContactDate: string | undefined;
}

interface toiawaseType {
  id: number;
  companyName: string;
  companySize: string;
  companyAddress: string;
  phoneNumber: string;
  businessActivities: string;
  isBlackList: boolean | string | undefined;
  crawlSource: string;
  createdAt: string;
  lastUpdateDate: string;
  companyWebsite: string;
}

interface toiawaseContactType {
  sendDate: string;
  sender: {
    fullName: string;
  };
  isSendSuccess: boolean;
  hasMeeting: boolean;
}

interface userType {
  id: number;
  email: string;
  fullName: string;
  username: string;
  createdAt: string;
}
