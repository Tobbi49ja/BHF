import {
  Activity, ArrowLeft, ArrowRight, BadgeCheck, BarChart2,
  Briefcase, Building2, Calculator, Calendar, Check,
  CheckCircle2, ChevronDown, ClipboardList, Droplets,
  Eye, EyeOff, FileSpreadsheet, Globe, HeartPulse,
  House, Lock, LogOut, Mail, MapPin, Menu, Phone,
  Ruler, Scale, ShieldCheck, ShieldPlus, Smartphone,
  TrendingUp, Trash2, User, UserRound, Users, X,
} from "lucide-react";

const MAP = {
  "activity": Activity, "arrow-left": ArrowLeft, "arrow-right": ArrowRight,
  "badge-check": BadgeCheck, "bar-chart-2": BarChart2, "briefcase": Briefcase,
  "building-2": Building2, "calculator": Calculator, "calendar": Calendar,
  "check": Check, "check-circle-2": CheckCircle2, "chevron-down": ChevronDown,
  "clipboard-list": ClipboardList, "droplets": Droplets, "eye": Eye,
  "eye-off": EyeOff, "file-spreadsheet": FileSpreadsheet, "globe": Globe,
  "heart-pulse": HeartPulse, "house": House, "lock": Lock, "log-out": LogOut,
  "mail": Mail, "map-pin": MapPin, "menu": Menu, "phone": Phone,
  "ruler": Ruler, "scale": Scale, "shield-check": ShieldCheck,
  "shield-plus": ShieldPlus, "smartphone": Smartphone, "trending-up": TrendingUp,
  "trash-2": Trash2, "user": User, "user-round": UserRound, "users": Users, "x": X,
};

export default function Icon({ name, size = 18, color, className, style }) {
  const C = MAP[name];
  if (!C) return <span style={{ display: "inline-block", width: size, height: size }} />;
  return <C size={size} color={color} className={className} style={style} strokeWidth={1.75} />;
}
