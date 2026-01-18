import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "./firebase";

export type CompanyInfo = {
  email: string;
  phone: string;
  mobilePhone: string;
  facebookUrl: string;
  wechatUrl: string;
  whatsappUrl: string;
  address: string;
  mapEmbedUrl: string;
};

export const defaultCompanyInfo: CompanyInfo = {
  email: "",
  phone: "",
  mobilePhone: "",
  facebookUrl: "",
  wechatUrl: "",
  whatsappUrl: "",
  address: "",
  mapEmbedUrl: "",
};

function readStringField(data: Record<string, any>, keys: string[]): string {
  for (const key of keys) {
    const value = data?.[key];
    if (typeof value === "string") {
      return value;
    }
    if (typeof value === "number") {
      return String(value);
    }
    if (value && typeof value === "object" && typeof value.stringValue === "string") {
      return value.stringValue;
    }
    if (value && typeof value === "object" && typeof value.numberValue !== "undefined") {
      return String(value.numberValue);
    }
  }
  return "";
}

function normalizeFacebookUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("www.")) {
    return `https://${trimmed}`;
  }
  if (trimmed.includes("facebook.com") || trimmed.includes("fb.com")) {
    return `https://${trimmed}`;
  }
  return `https://facebook.com/${trimmed.replace(/^@/, "")}`;
}

function normalizeWhatsAppUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("wa.me/") || trimmed.startsWith("www.wa.me/")) {
    return `https://${trimmed.replace(/^www\./, "")}`;
  }
  const digitsOnly = trimmed.replace(/[^\d]/g, "");
  if (digitsOnly) {
    return `https://wa.me/${digitsOnly}`;
  }
  return trimmed;
}

function normalizeWeChatUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("www.")) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export async function getCompanyInfo(): Promise<CompanyInfo> {
  if (!db) {
    return defaultCompanyInfo;
  }

  try {
    const companyRef = collection(db, "companyInfo");
    const snapshot = await getDocs(query(companyRef, limit(1)));

    if (snapshot.empty) {
      return defaultCompanyInfo;
    }

    const data = snapshot.docs[0].data() || {};

    return {
      email:
        readStringField(data, ["email"]) ||
        defaultCompanyInfo.email,
      phone:
        readStringField(data, ["company_phone"]) ||
        defaultCompanyInfo.phone,
      mobilePhone:
        readStringField(data, ["mobile_phone"]) ||
        defaultCompanyInfo.mobilePhone,
      facebookUrl:
        normalizeFacebookUrl(
          readStringField(data, [
            "fb",
          ])
        ) ||
        defaultCompanyInfo.facebookUrl,
      wechatUrl:
        normalizeWeChatUrl(
          readStringField(data, [
            "wechat",
          ])
        ) ||
        defaultCompanyInfo.wechatUrl,
      whatsappUrl:
        normalizeWhatsAppUrl(
          readStringField(data, [
            "whatsup",
          ])
        ) ||
        defaultCompanyInfo.whatsappUrl,
      address:
        readStringField(data, ["address"]) ||
        defaultCompanyInfo.address,
      mapEmbedUrl:
        readStringField(data, ["mapEmbedUrl", "mapUrl", "mapEmbed"]) ||
        defaultCompanyInfo.mapEmbedUrl,
    };
  } catch {
    return defaultCompanyInfo;
  }
}
