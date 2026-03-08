import {
  Activity, ArrowLeft, ArrowRight, BadgeCheck, BarChart2,
  Bell, Briefcase, Building2, Calculator, Calendar, Check,
  CheckCircle2, ChevronDown, ClipboardList, Droplets,
  Eye, EyeOff, FileSpreadsheet, FileText, Globe, Hash,
  HeartPulse, House, Landmark, Lock, LogOut, Mail, MapPin,
  Menu, MessageCircle, Navigation, Phone, RefreshCw,
  Ruler, Scale, Send, Server, ShieldCheck, ShieldPlus,
  Smartphone, TrendingUp, Trash2, User, UserRound, Users, X,
} from "lucide-react";

const MAP = {
  "activity":        Activity,
  "arrow-left":      ArrowLeft,
  "arrow-right":     ArrowRight,
  "badge-check":     BadgeCheck,
  "bar-chart-2":     BarChart2,
  "bell":            Bell,
  "briefcase":       Briefcase,
  "building-2":      Building2,
  "calculator":      Calculator,
  "calendar":        Calendar,
  "check":           Check,
  "check-circle-2":  CheckCircle2,
  "chevron-down":    ChevronDown,
  "clipboard-list":  ClipboardList,
  "droplets":        Droplets,
  "eye":             Eye,
  "eye-off":         EyeOff,
  "file-spreadsheet":FileSpreadsheet,
  "file-text":       FileText,
  "globe":           Globe,
  "hash":            Hash,
  "heart-pulse":     HeartPulse,
  "house":           House,
  "landmark":        Landmark,
  "lock":            Lock,
  "log-out":         LogOut,
  "mail":            Mail,
  "map-pin":         MapPin,
  "menu":            Menu,
  "message-circle":  MessageCircle,
  "navigation":      Navigation,
  "phone":           Phone,
  "refresh-cw":      RefreshCw,
  "ruler":           Ruler,
  "scale":           Scale,
  "send":            Send,
  "server":          Server,
  "shield-check":    ShieldCheck,
  "shield-plus":     ShieldPlus,
  "smartphone":      Smartphone,
  "search":          ({ size, color, className, style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color || "currentColor"} strokeWidth={1.75} strokeLinecap="round"
      strokeLinejoin="round" className={className} style={style}>
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  "trending-up":     TrendingUp,
  "trash-2":         Trash2,
  "user":            User,
  "user-round":      UserRound,
  "users":           Users,
  "x":               X,
};

export default function Icon({ name, size = 18, color, className, style }) {
  const C = MAP[name];
  if (!C) return <span style={{ display: "inline-block", width: size, height: size }} />;
  return <C size={size} color={color} className={className} style={style} strokeWidth={1.75} />;
}