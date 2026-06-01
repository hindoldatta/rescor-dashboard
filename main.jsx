import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, ComposedChart, Legend, AreaChart, Area, ScatterChart, Scatter, ZAxis, ReferenceLine } from "recharts";
import { Shield, Users, DollarSign, TrendingUp, Activity, ArrowUpRight, ArrowDownRight, Clock, Target, AlertTriangle, Wallet, Receipt, TrendingDown, Building2, CalendarDays, Landmark, ChevronRight, CreditCard, FileText, UserCheck, Briefcase, XCircle, CheckCircle, FileCheck, Scale, CalendarCheck, FolderOpen, ArrowLeft, Phone, Mail, MapPin, Crosshair } from "lucide-react";

const GOLD="#C9A84C",BG_PRIMARY="#08080A",BG_CARD="#111114",BG_CARD_HOVER="#18181C",BG_SIDEBAR="#0C0C0F",BORDER="#1F1F24",BORDER_LIGHT="#2A2A30",TEXT_PRIMARY="#F0EDE6",TEXT_SECONDARY="#8A8A95",TEXT_MUTED="#55555F",SUCCESS="#34D399",WARNING="#FBBF24",DANGER="#F87171",INFO="#60A5FA";
const SEGMENT_COLORS={"Corporate Enterprises":"#C9A84C","Senior Executives":"#60A5FA","Private Family Offices":"#34D399","Private Clients":"#A78BFA","Government & Public Sector":"#F87171"};
const SERVICE_COLORS={"Executive Protection":"#C9A84C","Residential Security":"#60A5FA","Special Projects":"#34D399","Strategic Consulting":"#A78BFA"};
const GEO_COLORS={"West Coast":"#C9A84C","Northeast":"#60A5FA","Southeast":"#34D399","Texas / Central":"#F87171","International":"#A78BFA"};

const MONTHS=["Jun 2025","Jul 2025","Aug 2025","Sep 2025","Oct 2025","Nov 2025","Dec 2025","Jan 2026","Feb 2026","Mar 2026","Apr 2026","May 2026"];
const MONTH_KEYS=MONTHS.map((m,i)=>({label:m,index:i}));
const G=[1.0,1.04,1.09,1.15,1.22,1.30,1.38,1.48,1.56,1.65,1.74,1.82];
const MON_MAP={"Jan":0,"Feb":1,"Mar":2,"Apr":3,"May":4,"Jun":5,"Jul":6,"Aug":7,"Sep":8,"Oct":9,"Nov":10,"Dec":11};
const parseMS=(s)=>{if(!s||s==="Ongoing")return null;const p=s.split(" ");return parseInt(p[1])*12+MON_MAP[p[0]];};
const periodOverlap=(cStart,cEnd,pStart,pEnd)=>{const cs=parseMS(cStart),ce=parseMS(cEnd),ps=parseMS(pStart),pe=parseMS(pEnd);if(cs===null)return true;if(ce===null)return cs<=pe;return cs<=pe&&ce>=ps;};
const inPeriod=(dateStr,pStart,pEnd)=>{const d=parseMS(dateStr),ps=parseMS(pStart),pe=parseMS(pEnd);if(d===null)return false;return d>=ps&&d<=pe;};

const genMR=()=>{const b={"Corporate Enterprises":320,"Senior Executives":280,"Private Family Offices":190,"Private Clients":110,"Government & Public Sector":240};return MONTHS.map((m,i)=>{const r={month:m};let t=0;Object.entries(b).forEach(([s,v])=>{const val=Math.round(v*G[i]*(0.92+Math.sin(i*1.7+s.length)*0.12));r[s]=val;t+=val;});r.total=t;return r;});};
const MONTHLY_REVENUE=genMR();
const SERVICE_REVENUE=MONTHS.map((m,i)=>({month:m,"Executive Protection":Math.round(480*G[i]*(0.95+Math.sin(i)*0.08)),"Residential Security":Math.round(290*G[i]*(0.93+Math.cos(i)*0.1)),"Special Projects":Math.round(180*G[i]*(0.9+Math.sin(i+2)*0.15)),"Strategic Consulting":Math.round(120*G[i]*(0.88+Math.cos(i+1)*0.12))}));
const GEO_REVENUE=MONTHS.map((m,i)=>({month:m,"West Coast":Math.round(380*G[i]),"Northeast":Math.round(310*G[i]*(0.95+Math.sin(i)*0.05)),"Southeast":Math.round(190*G[i]*(0.9+Math.cos(i)*0.1)),"Texas / Central":Math.round(140*G[i]),"International":Math.round(120*G[i]*(1.0+i*0.03))}));

const CLIENTS=[
  {name:"Meridian Holdings",segment:"Corporate Enterprises",geo:"West Coast",service:"Executive Protection",annualRev:1420,margin:52,operators:6},
  {name:"Vanguard Capital Group",segment:"Senior Executives",geo:"Northeast",service:"Executive Protection",annualRev:1180,margin:48,operators:4},
  {name:"Atlas Family Trust",segment:"Private Family Offices",geo:"Southeast",service:"Residential Security",annualRev:980,margin:55,operators:5},
  {name:"Centurion Defense Systems",segment:"Government & Public Sector",geo:"Texas / Central",service:"Special Projects",annualRev:1650,margin:38,operators:8},
  {name:"Apex Ventures",segment:"Corporate Enterprises",geo:"West Coast",service:"Strategic Consulting",annualRev:420,margin:62,operators:1},
  {name:"Harmon Estate",segment:"Private Clients",geo:"Northeast",service:"Residential Security",annualRev:860,margin:51,operators:4},
  {name:"Pacific Rim Logistics",segment:"Corporate Enterprises",geo:"International",service:"Executive Protection",annualRev:1340,margin:44,operators:6},
  {name:"Sterling & Associates",segment:"Senior Executives",geo:"West Coast",service:"Executive Protection",annualRev:720,margin:50,operators:3},
  {name:"Blackridge Minerals",segment:"Corporate Enterprises",geo:"International",service:"Special Projects",annualRev:1890,margin:36,operators:9},
  {name:"Kensington Partners",segment:"Private Family Offices",geo:"Northeast",service:"Residential Security",annualRev:1100,margin:54,operators:5},
  {name:"Federal Bureau of Prisons",segment:"Government & Public Sector",geo:"Southeast",service:"Strategic Consulting",annualRev:380,margin:58,operators:1},
  {name:"Whitfield Media Group",segment:"Private Clients",geo:"West Coast",service:"Executive Protection",annualRev:640,margin:47,operators:3},
  {name:"Omni Infrastructure",segment:"Corporate Enterprises",geo:"Texas / Central",service:"Executive Protection",annualRev:920,margin:45,operators:4},
  {name:"Northstar Foundation",segment:"Private Family Offices",geo:"Southeast",service:"Residential Security",annualRev:760,margin:53,operators:3},
  {name:"DHS Region IV",segment:"Government & Public Sector",geo:"Southeast",service:"Special Projects",annualRev:2100,margin:34,operators:10},
  {name:"Caldwell Private Office",segment:"Senior Executives",geo:"International",service:"Executive Protection",annualRev:580,margin:42,operators:2},
];

const UTILIZATION=[
  {segment:"Corporate Enterprises",deployed:22,bench:4,training:2,utilization:79},
  {segment:"Senior Executives",deployed:9,bench:2,training:1,utilization:75},
  {segment:"Private Family Offices",deployed:13,bench:1,training:1,utilization:87},
  {segment:"Private Clients",deployed:7,bench:2,training:0,utilization:78},
  {segment:"Government & Public Sector",deployed:19,bench:3,training:2,utilization:79},
];

// ─── ENHANCED PIPELINE WITH STAGES ─────────────────────────────
const PIPELINE_STAGES = ["First Contact","Discovery Call","Proposal Sent","Contract Negotiation","Closed-Won","Closed-Lost"];
const STAGE_COLORS_NEW = {"First Contact":TEXT_MUTED,"Discovery Call":"#818CF8","Proposal Sent":INFO,"Contract Negotiation":WARNING,"Closed-Won":SUCCESS,"Closed-Lost":DANGER};

const PIPELINE=[
  {client:"Titan Aerospace",segment:"Corporate Enterprises",service:"Executive Protection",value:840,stage:"Contract Negotiation",probability:65,expectedClose:"Jul 2026",geo:"West Coast",contact:"James Liu, CSO",lastActivity:"May 28, 2026",nextStep:"Final pricing review"},
  {client:"Beaumont Family Trust",segment:"Private Family Offices",service:"Residential Security",value:620,stage:"Proposal Sent",probability:40,expectedClose:"Aug 2026",geo:"Northeast",contact:"Margaret Beaumont",lastActivity:"May 22, 2026",nextStep:"Site assessment scheduled"},
  {client:"State Dept. Africa Desk",segment:"Government & Public Sector",service:"Special Projects",value:1450,stage:"Contract Negotiation",probability:55,expectedClose:"Jul 2026",geo:"International",contact:"COTR Office",lastActivity:"May 25, 2026",nextStep:"Security clearance verification"},
  {client:"Redwood Equity",segment:"Senior Executives",service:"Executive Protection",value:380,stage:"First Contact",probability:15,expectedClose:"Oct 2026",geo:"West Coast",contact:"David Chen, CEO",lastActivity:"May 20, 2026",nextStep:"Intro call with Wayne"},
  {client:"Pinnacle Holdings",segment:"Corporate Enterprises",service:"Strategic Consulting",value:290,stage:"Discovery Call",probability:30,expectedClose:"Aug 2026",geo:"Texas / Central",contact:"Sarah Mitchell, VP Ops",lastActivity:"May 24, 2026",nextStep:"Threat assessment proposal"},
  {client:"USAID Mission Support",segment:"Government & Public Sector",service:"Special Projects",value:1820,stage:"First Contact",probability:10,expectedClose:"Nov 2026",geo:"International",contact:"Procurement Office",lastActivity:"May 18, 2026",nextStep:"RFP response due Jun 15"},
  {client:"Monaco Private Office",segment:"Private Clients",service:"Executive Protection",value:510,stage:"Contract Negotiation",probability:70,expectedClose:"Jun 2026",geo:"International",contact:"Pierre Dumont",lastActivity:"May 29, 2026",nextStep:"Legal review of MSA"},
  {client:"Ashworth Residences",segment:"Private Family Offices",service:"Residential Security",value:440,stage:"Proposal Sent",probability:35,expectedClose:"Sep 2026",geo:"Southeast",contact:"Estate Manager",lastActivity:"May 21, 2026",nextStep:"Budget approval pending"},
  {client:"Granite Peak Mining",segment:"Corporate Enterprises",service:"Special Projects",value:960,stage:"Contract Negotiation",probability:60,expectedClose:"Jul 2026",geo:"International",contact:"Tom Bradley, COO",lastActivity:"May 27, 2026",nextStep:"Insurance cert exchange"},
  {client:"Nexus Pharma",segment:"Corporate Enterprises",service:"Executive Protection",value:700,stage:"Discovery Call",probability:25,expectedClose:"Oct 2026",geo:"Northeast",contact:"Karen Walsh, CHRO",lastActivity:"May 23, 2026",nextStep:"Needs assessment meeting"},
  {client:"Fort Worth ISD",segment:"Government & Public Sector",service:"Strategic Consulting",value:180,stage:"Closed-Won",probability:100,expectedClose:"Jun 2026",geo:"Texas / Central",contact:"Board Office",lastActivity:"May 15, 2026",nextStep:"Kickoff scheduled Jun 2"},
  {client:"Bishop Estate",segment:"Private Clients",service:"Residential Security",value:390,stage:"Closed-Lost",probability:0,expectedClose:"May 2026",geo:"West Coast",contact:"Family Office",lastActivity:"May 10, 2026",nextStep:"-",lossReason:"Budget constraints"},
  {client:"Lakeview Capital",segment:"Corporate Enterprises",service:"Executive Protection",value:680,stage:"Closed-Lost",probability:0,expectedClose:"Apr 2026",geo:"Northeast",contact:"Risk Committee",lastActivity:"Apr 28, 2026",nextStep:"-",lossReason:"Chose incumbent vendor"},
  {client:"Sagebrush Holdings",segment:"Senior Executives",service:"Executive Protection",value:450,stage:"Closed-Lost",probability:0,expectedClose:"Mar 2026",geo:"West Coast",contact:"CEO Assistant",lastActivity:"Mar 15, 2026",nextStep:"-",lossReason:"Decided to hire in-house"},
  {client:"GlobalTech Foundation",segment:"Corporate Enterprises",service:"Strategic Consulting",value:220,stage:"Closed-Lost",probability:0,expectedClose:"Feb 2026",geo:"International",contact:"Exec Director",lastActivity:"Feb 20, 2026",nextStep:"-",lossReason:"Project scope reduced"},
  {client:"Meridian West Fund",segment:"Private Family Offices",service:"Residential Security",value:550,stage:"Closed-Lost",probability:0,expectedClose:"Jan 2026",geo:"West Coast",contact:"Trust Officer",lastActivity:"Jan 12, 2026",nextStep:"-",lossReason:"Budget constraints"},
];

// ─── CLIENT CONTRACTS ───────────────────────────────────────────
const CLIENT_CONTRACTS=[
  {client:"Meridian Holdings",type:"Retainer",service:"Executive Protection",startDate:"Jan 2024",endDate:"Dec 2026",annualValue:1420,autoRenew:true,status:"Active",terms:"Net 30",notice:"90 days"},
  {client:"Vanguard Capital Group",type:"Retainer",service:"Executive Protection",startDate:"Mar 2024",endDate:"Feb 2027",annualValue:1180,autoRenew:true,status:"Active",terms:"Net 30",notice:"60 days"},
  {client:"Atlas Family Trust",type:"Retainer",service:"Residential Security",startDate:"Jun 2023",endDate:"May 2026",annualValue:980,autoRenew:true,status:"Renewal Due",terms:"Net 15",notice:"90 days"},
  {client:"Centurion Defense Systems",type:"IDIQ",service:"Special Projects",startDate:"Sep 2024",endDate:"Sep 2027",annualValue:1650,autoRenew:false,status:"Active",terms:"Net 45",notice:"120 days"},
  {client:"Apex Ventures",type:"Project",service:"Strategic Consulting",startDate:"Feb 2026",endDate:"Jul 2026",annualValue:420,autoRenew:false,status:"Active",terms:"Net 30",notice:"30 days"},
  {client:"Harmon Estate",type:"Retainer",service:"Residential Security",startDate:"Aug 2024",endDate:"Jul 2027",annualValue:860,autoRenew:true,status:"Active",terms:"Net 15",notice:"60 days"},
  {client:"Pacific Rim Logistics",type:"Retainer",service:"Executive Protection",startDate:"Nov 2023",endDate:"Oct 2026",annualValue:1340,autoRenew:true,status:"Active",terms:"Net 30",notice:"90 days"},
  {client:"Sterling & Associates",type:"Retainer",service:"Executive Protection",startDate:"Apr 2025",endDate:"Mar 2028",annualValue:720,autoRenew:true,status:"Active",terms:"Net 30",notice:"60 days"},
  {client:"Blackridge Minerals",type:"Project",service:"Special Projects",startDate:"Jan 2025",endDate:"Dec 2026",annualValue:1890,autoRenew:false,status:"Active",terms:"Net 45",notice:"60 days"},
  {client:"Kensington Partners",type:"Retainer",service:"Residential Security",startDate:"May 2024",endDate:"Apr 2027",annualValue:1100,autoRenew:true,status:"Active",terms:"Net 15",notice:"90 days"},
  {client:"Federal Bureau of Prisons",type:"IDIQ",service:"Strategic Consulting",startDate:"Oct 2025",endDate:"Sep 2026",annualValue:380,autoRenew:false,status:"Active",terms:"Net 60",notice:"30 days"},
  {client:"Whitfield Media Group",type:"Retainer",service:"Executive Protection",startDate:"Jul 2025",endDate:"Jun 2028",annualValue:640,autoRenew:true,status:"Active",terms:"Net 30",notice:"60 days"},
  {client:"DHS Region IV",type:"IDIQ",service:"Special Projects",startDate:"Mar 2024",endDate:"Mar 2027",annualValue:2100,autoRenew:false,status:"Active",terms:"Net 60",notice:"120 days"},
  {client:"Caldwell Private Office",type:"Project",service:"Executive Protection",startDate:"Dec 2025",endDate:"Nov 2026",annualValue:580,autoRenew:false,status:"Active",terms:"Net 30",notice:"30 days"},
];

const VENDOR_CONTRACTS=[
  {vendor:"HUB International",category:"Insurance - General Liability",monthlyValue:42,startDate:"Jan 2025",endDate:"Dec 2025",autoRenew:true,status:"Renewal Due",terms:"Annual Premium",notice:"60 days"},
  {vendor:"Lloyd's of London",category:"Insurance - Professional Indemnity",monthlyValue:28,startDate:"Mar 2025",endDate:"Feb 2026",autoRenew:true,status:"Active",terms:"Annual Premium",notice:"90 days"},
  {vendor:"AmTrust North",category:"Insurance - Workers Comp",monthlyValue:35,startDate:"Jun 2025",endDate:"May 2026",autoRenew:true,status:"Active",terms:"Annual Premium",notice:"60 days"},
  {vendor:"Ropers Majeski PC",category:"Legal - General Counsel",monthlyValue:15,startDate:"Jan 2024",endDate:"Ongoing",autoRenew:false,status:"Active",terms:"Monthly Retainer",notice:"30 days"},
  {vendor:"ADP TotalSource",category:"Payroll & HR",monthlyValue:18,startDate:"Jul 2024",endDate:"Jun 2027",autoRenew:true,status:"Active",terms:"Net 30",notice:"90 days"},
  {vendor:"Guardian Fleet Services",category:"Armored Vehicle Leasing",monthlyValue:22,startDate:"Sep 2024",endDate:"Aug 2027",autoRenew:false,status:"Active",terms:"Monthly Lease",notice:"60 days"},
  {vendor:"Palantir Federal",category:"Technology - Threat Intel Platform",monthlyValue:12,startDate:"Jan 2026",endDate:"Dec 2026",autoRenew:true,status:"Active",terms:"Annual License",notice:"30 days"},
  {vendor:"WeWork Enterprise",category:"Office Space - Oakland HQ",monthlyValue:14,startDate:"Apr 2024",endDate:"Mar 2027",autoRenew:true,status:"Active",terms:"Monthly Lease",notice:"90 days"},
  {vendor:"T-Mobile Business",category:"Communications - Mobile Fleet",monthlyValue:8,startDate:"Feb 2025",endDate:"Jan 2028",autoRenew:true,status:"Active",terms:"Net 30",notice:"30 days"},
  {vendor:"Axis Training Group",category:"Operator Training & Certification",monthlyValue:6,startDate:"Jun 2025",endDate:"May 2026",autoRenew:true,status:"Active",terms:"Quarterly",notice:"30 days"},
];

// ─── FINANCE DATA ───────────────────────────────────────────────
const PNL_DATA=MONTHS.map((m,i)=>{const rev=MONTHLY_REVENUE[i].total;const cos=Math.round(rev*(0.52-i*0.005+Math.sin(i)*0.02));const operatorComp=Math.round(cos*0.78);const otherDirect=cos-operatorComp;const gm=rev-cos;const sm=Math.round(rev*(0.12+Math.sin(i*0.8)*0.015));const ga=Math.round(145+i*8+Math.cos(i)*12);const op=gm-sm-ga;const budgetRev=Math.round(rev*(0.95+i*0.008));const budgetCoS=Math.round(budgetRev*0.50);const budgetGM=budgetRev-budgetCoS;const budgetSM=Math.round(budgetRev*0.11);const budgetGA=Math.round(140+i*7);const budgetOP=budgetGM-budgetSM-budgetGA;return{month:m,revenue:rev,costOfService:cos,operatorComp,otherDirect,grossMargin:gm,grossMarginPct:Math.round(gm/rev*100),salesMarketing:sm,gAndA:ga,operatingProfit:op,opMarginPct:Math.round(op/rev*100),budgetRev,budgetCoS,budgetGM,budgetSM,budgetGA,budgetOP,payrollPct:Math.round(operatorComp/rev*100)};});

const AR_AGING=[
  {client:"DHS Region IV",total:485,current:210,days30:180,days60:75,days90:20,segment:"Government & Public Sector"},
  {client:"Blackridge Minerals",total:412,current:190,days30:142,days60:80,days90:0,segment:"Corporate Enterprises"},
  {client:"Centurion Defense Systems",total:365,current:240,days30:95,days60:30,days90:0,segment:"Government & Public Sector"},
  {client:"Meridian Holdings",total:320,current:280,days30:40,days60:0,days90:0,segment:"Corporate Enterprises"},
  {client:"Pacific Rim Logistics",total:295,current:150,days30:95,days60:50,days90:0,segment:"Corporate Enterprises"},
  {client:"Kensington Partners",total:248,current:188,days30:60,days60:0,days90:0,segment:"Private Family Offices"},
  {client:"Atlas Family Trust",total:215,current:175,days30:40,days60:0,days90:0,segment:"Private Family Offices"},
  {client:"Vanguard Capital Group",total:198,current:130,days30:48,days60:20,days90:0,segment:"Senior Executives"},
  {client:"Harmon Estate",total:185,current:145,days30:40,days60:0,days90:0,segment:"Private Clients"},
  {client:"Federal Bureau of Prisons",total:92,current:42,days30:30,days60:20,days90:0,segment:"Government & Public Sector"},
];
const TOTAL_AR=AR_AGING.reduce((s,r)=>s+r.total,0);
const AP_SUMMARY=[
  {category:"Operator Payroll",total:620,current:420,days30:150,days60:50},
  {category:"Insurance Premiums",total:185,current:185,days30:0,days60:0},
  {category:"Travel & Logistics",total:142,current:98,days30:44,days60:0},
  {category:"Technology & Comms",total:68,current:68,days30:0,days60:0},
  {category:"Professional Services",total:55,current:35,days30:20,days60:0},
  {category:"Facilities & Office",total:48,current:48,days30:0,days60:0},
];
const TOTAL_AP=AP_SUMMARY.reduce((s,r)=>s+r.total,0);
const CASH_BALANCE=2840,CREDIT_LINE=1500,CREDIT_DRAWN=400;

const WEEKLY_FORECAST=(()=>{const w=[];let b=CASH_BALANCE;const bI=[420,380,510,440,395,480,520,390,460,505,435,490,540];const bO=[385,410,370,420,380,395,440,405,380,415,390,410,430];for(let i=0;i<13;i++){const inf=bI[i]+Math.round(Math.sin(i*0.9)*40);const out=bO[i]+Math.round(Math.cos(i*1.1)*30);const net=inf-out;b+=net;w.push({week:`W${i+1}`,date:new Date(2026,4,31+i*7).toLocaleDateString("en-US",{month:"short",day:"numeric"}),inflow:inf,outflow:out,net,balance:b});}return w;})();

// ─── MONTHLY CLOSE DATA ─────────────────────────────────────────
const MONTHLY_CLOSE=MONTHS.map((m,i)=>{
  const pnl=PNL_DATA[i];const rev=pnl.revenue;
  const cashBal=Math.round(2200+i*55+Math.sin(i)*120);const ar=Math.round(280+i*18+Math.cos(i)*30);const prepaid=Math.round(85+i*3);const fixedAssets=Math.round(420-i*5);
  const totalAssets=cashBal+ar+prepaid+fixedAssets;
  const ap=Math.round(180+i*8+Math.sin(i+1)*20);const accrued=Math.round(220+i*12);const debt=Math.round(400-i*10);
  const totalLiab=ap+accrued+debt;const equity=totalAssets-totalLiab;
  const cfOps=Math.round(pnl.operatingProfit+45+Math.sin(i)*30);const cfInv=Math.round(-35-i*2);const cfFin=Math.round(-20+Math.cos(i)*15);const cfNet=cfOps+cfInv+cfFin;
  const totalEmp=Math.round(82+i*3);const billableEmp=Math.round(68+i*2.5);
  const util=Math.round(75+i*0.8+Math.sin(i)*3);
  const grossPipe=Math.round(4800+i*180+Math.cos(i)*200);const weightPipe=Math.round(grossPipe*(0.38+i*0.01));
  const wr=Math.round(42+i*1.5+Math.sin(i)*5);
  const dso=Math.round(42-i*0.3+Math.cos(i)*4);const dpo=Math.round(28+i*0.5+Math.sin(i)*3);
  const custRetention=Math.round(92+i*0.3+Math.sin(i)*1.5);const dollarRetention=Math.round(105+i*0.8+Math.cos(i)*2);
  const closeDay=Math.round(12-i*0.4+Math.sin(i)*2);const closeDate=`${m.split(" ")[0]} ${Math.max(5,Math.min(18,closeDay))}, ${m.split(" ")[1]}`;
  const alertPool=[
    ["AR aging: DHS Region IV 60+ days past due","warning"],["Operator payroll up 6% MoM, review staffing levels","warning"],["Insurance renewal due: HUB International GL policy","danger"],
    ["Government contract IDIQ ceiling approaching 80%","warning"],["Cash position strong, consider paying down credit line","info"],["Atlas Family Trust contract expires this month","danger"],
    ["New client onboarding delayed: Titan Aerospace clearances pending","warning"],["Bench utilization improved 4pp from prior month","info"],["S&M spend 8% over budget, review conference costs","warning"],
    ["Blackridge Minerals AR approaching 90 days","danger"],["Training costs above plan: 3 new operator certifications","info"],["AP terms renegotiated with Guardian Fleet: Net 45 to Net 60","info"],
    ["Revenue recognition review needed: Apex project milestones","warning"],["DPO trending down, stretching payables advisable","warning"],["Caldwell Private Office requesting scope expansion","info"],
  ];
  const alerts=[(i*3)%alertPool.length,(i*3+1)%alertPool.length,(i*3+2)%alertPool.length].map(j=>({text:alertPool[j][0],type:alertPool[j][1]}));
  return{month:m,pnl,cashBal,ar,prepaid,fixedAssets,totalAssets,ap,accrued,debt,totalLiab,equity,cfOps,cfInv,cfFin,cfNet,totalEmp,billableEmp,util,grossPipe,weightPipe,winRate:wr,dso,dpo,custRetention,dollarRetention,closeDate,alerts};
});

// ─── UTILITIES ──────────────────────────────────────────────────
const fmt=(n)=>Math.abs(n)>=1000?`$${(n/1000).toFixed(1)}M`:`$${n}K`;
const CustomTooltip=({active,payload,label,formatter})=>{if(!active||!payload?.length)return null;return(<div style={{background:BG_CARD,border:`1px solid ${BORDER_LIGHT}`,borderRadius:8,padding:"10px 14px",fontSize:12,zIndex:100}}><div style={{color:TEXT_SECONDARY,marginBottom:6,fontWeight:600}}>{label}</div>{payload.filter(p=>p.value!=null).map((p,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><div style={{width:8,height:8,borderRadius:4,background:p.color||p.stroke}}/><span style={{color:TEXT_SECONDARY}}>{p.name}:</span><span style={{color:TEXT_PRIMARY,fontWeight:600}}>{formatter?formatter(p.value):p.value}</span></div>))}</div>);};

const KPICard=({icon:Icon,label,value,sub,trend,trendDir,accent=GOLD,small})=>(<div style={{background:BG_CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:small?"14px 16px":"18px 20px",flex:1,minWidth:small?150:190,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${accent},transparent)`}}/><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{minWidth:0,flex:1}}><div style={{color:TEXT_MUTED,fontSize:10,fontWeight:600,letterSpacing:1.2,textTransform:"uppercase",marginBottom:6}}>{label}</div><div style={{color:TEXT_PRIMARY,fontSize:small?22:26,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",lineHeight:1.1}}>{value}</div>{sub&&<div style={{color:TEXT_SECONDARY,fontSize:11,marginTop:5}}>{sub}</div>}</div><div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0}}><div style={{background:`${accent}15`,borderRadius:8,padding:7}}><Icon size={16} color={accent}/></div>{trend&&(<div style={{display:"flex",alignItems:"center",gap:2,fontSize:11,fontWeight:600,color:trendDir==="up"?SUCCESS:trendDir==="down"?DANGER:WARNING}}>{trendDir==="up"?<ArrowUpRight size={13}/>:trendDir==="down"?<ArrowDownRight size={13}/>:null}{trend}</div>)}</div></div></div>);

const SH=({title,subtitle})=>(<div style={{marginBottom:14}}><h3 style={{color:TEXT_PRIMARY,fontSize:14,fontWeight:600,margin:0,letterSpacing:0.3}}>{title}</h3>{subtitle&&<p style={{color:TEXT_MUTED,fontSize:11,margin:"3px 0 0"}}>{subtitle}</p>}</div>);
const Card=({children,style={}})=>(<div style={{background:BG_CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20,...style}}>{children}</div>);

const NAV_ITEMS=[
  {key:"ceo",label:"CEO View",icon:Building2,desc:"Revenue & Operations"},
  {key:"cso",label:"Sales Pipeline",icon:Target,desc:"Pipeline, Win/Loss & Bookings"},
  {key:"finance",label:"Head of Finance",icon:Landmark,desc:"P&L, Cash & Working Capital"},
  {key:"contracts",label:"Contracts",icon:FileCheck,desc:"Client & Vendor Agreements"},
  {key:"close",label:"Monthly Close",icon:CalendarCheck,desc:"Close Calendar & Period Detail"},
  {key:"dataroom",label:"Data Room",icon:FolderOpen,desc:"Document Repository & Readiness"},
  {key:"opsmap",label:"Operations Theater",icon:Crosshair,desc:"Geographic Deployment & Revenue"},
];

// ═════════════════════════════════════════════════════════════════
export default function RescorDashboard(){
  const[view,setView]=useState("finance");
  const[startMonth,setStartMonth]=useState(0);
  const[endMonth,setEndMonth]=useState(11);
  const[sidebarCollapsed,setSidebarCollapsed]=useState(false);

  const filteredRevenue=MONTHLY_REVENUE.slice(startMonth,endMonth+1);
  const filteredServiceRev=SERVICE_REVENUE.slice(startMonth,endMonth+1);
  const filteredGeoRev=GEO_REVENUE.slice(startMonth,endMonth+1);
  const filteredPnl=PNL_DATA.slice(startMonth,endMonth+1);
  const totalRevenue=filteredRevenue.reduce((s,r)=>s+r.total,0);
  const priorRev=totalRevenue*0.72;
  const revGrowth=((totalRevenue/priorRev-1)*100).toFixed(1);
  const totalOps=UTILIZATION.reduce((s,u)=>s+u.deployed+u.bench+u.training,0);
  const deployedOps=UTILIZATION.reduce((s,u)=>s+u.deployed,0);
  const avgUtil=Math.round(UTILIZATION.reduce((s,u)=>s+u.utilization,0)/UTILIZATION.length);
  const benchOps=UTILIZATION.reduce((s,u)=>s+u.bench,0);
  const benchCost=benchOps*680;
  const avgMargin=Math.round(CLIENTS.reduce((s,c)=>s+c.margin,0)/CLIENTS.length);
  const segments=Object.keys(SEGMENT_COLORS);
  const segTotals=segments.map(seg=>({name:seg,value:filteredRevenue.reduce((s,r)=>s+(r[seg]||0),0)}));
  const totalSegRev=segTotals.reduce((s,d)=>s+d.value,0);
  const svcTotals=Object.keys(SERVICE_COLORS).map(s=>({name:s,value:filteredServiceRev.reduce((sum,r)=>sum+(r[s]||0),0)}));
  const activePL=PIPELINE.filter(p=>!["Closed-Won","Closed-Lost"].includes(p.stage));
  const weightedPL=activePL.reduce((s,p)=>s+p.value*p.probability/100,0);
  const wonDeals=PIPELINE.filter(p=>p.stage==="Closed-Won");
  const lostDeals=PIPELINE.filter(p=>p.stage==="Closed-Lost");
  const winRate=wonDeals.length+lostDeals.length>0?Math.round(wonDeals.length/(wonDeals.length+lostDeals.length)*100):0;

  const selectStyle={background:BG_CARD,color:TEXT_PRIMARY,border:`1px solid ${BORDER_LIGHT}`,borderRadius:8,padding:"6px 10px",fontSize:12,outline:"none",cursor:"pointer",WebkitAppearance:"none",appearance:"none"};

  return(
    <div style={{background:BG_PRIMARY,minHeight:"100vh",fontFamily:"'DM Sans',system-ui,sans-serif",color:TEXT_PRIMARY,display:"flex"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:${BG_PRIMARY}}::-webkit-scrollbar-thumb{background:${BORDER_LIGHT};border-radius:3px}select option{background:${BG_CARD};color:${TEXT_PRIMARY}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>

      {/* SIDEBAR */}
      <aside style={{width:sidebarCollapsed?60:230,minHeight:"100vh",background:BG_SIDEBAR,borderRight:`1px solid ${BORDER}`,display:"flex",flexDirection:"column",transition:"width 0.3s",flexShrink:0,position:"sticky",top:0,height:"100vh",overflow:"hidden"}}>
        <div style={{padding:sidebarCollapsed?"18px 14px":"18px 20px",borderBottom:`1px solid ${BORDER}`,display:"flex",alignItems:"center",gap:10,cursor:"pointer",minHeight:62}} onClick={()=>setSidebarCollapsed(!sidebarCollapsed)}>
          <Shield size={22} color={GOLD} strokeWidth={2.5} style={{flexShrink:0}}/>
          {!sidebarCollapsed&&<div><div style={{fontSize:14,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",color:GOLD,letterSpacing:1.5,lineHeight:1}}>RESCOR GROUP</div><div style={{fontSize:8,color:TEXT_MUTED,letterSpacing:2,textTransform:"uppercase",marginTop:2}}>Executive Dashboard</div></div>}
        </div>
        <nav style={{padding:"12px 8px",flex:1,display:"flex",flexDirection:"column",gap:3}}>
          {NAV_ITEMS.map(item=>{const active=view===item.key;return(
            <button key={item.key} onClick={()=>setView(item.key)} style={{display:"flex",alignItems:"center",gap:10,padding:sidebarCollapsed?"10px 14px":"10px 12px",borderRadius:8,border:"none",cursor:"pointer",background:active?`${GOLD}15`:"transparent",transition:"all 0.2s",width:"100%",textAlign:"left"}}>
              <item.icon size={18} color={active?GOLD:TEXT_MUTED} style={{flexShrink:0}}/>
              {!sidebarCollapsed&&<div style={{minWidth:0}}><div style={{fontSize:12,fontWeight:600,color:active?GOLD:TEXT_SECONDARY,whiteSpace:"nowrap"}}>{item.label}</div><div style={{fontSize:9,color:TEXT_MUTED,whiteSpace:"nowrap"}}>{item.desc}</div></div>}
              {!sidebarCollapsed&&active&&<ChevronRight size={14} color={GOLD} style={{marginLeft:"auto",flexShrink:0}}/>}
            </button>
          );})}
        </nav>
        {!sidebarCollapsed&&<div style={{padding:"10px 16px",borderTop:`1px solid ${BORDER}`}}>
          <div style={{fontSize:8,color:TEXT_MUTED,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Proof of Concept</div>
          <div style={{fontSize:9,color:TEXT_MUTED}}>All data illustrative</div>
          <div style={{marginTop:8,fontSize:9,color:TEXT_MUTED}}>Prepared by<br/><span style={{color:GOLD,fontWeight:600,fontSize:10}}>Hindol Datta</span></div>
        </div>}
      </aside>

      {/* MAIN */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        <header style={{borderBottom:`1px solid ${BORDER}`,padding:"10px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10,position:"sticky",top:0,zIndex:50,background:`${BG_PRIMARY}ee`,backdropFilter:"blur(12px)"}}>
          <div style={{fontSize:15,fontWeight:600}}>{NAV_ITEMS.find(n=>n.key===view)?.label}<span style={{color:TEXT_MUTED,fontWeight:400,fontSize:12,marginLeft:8}}>{NAV_ITEMS.find(n=>n.key===view)?.desc}</span></div>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <CalendarDays size={13} color={TEXT_MUTED}/>
            <select value={startMonth} onChange={e=>{const v=+e.target.value;setStartMonth(v);if(v>endMonth)setEndMonth(v);}} style={selectStyle}>{MONTH_KEYS.map(m=><option key={m.index} value={m.index}>{m.label}</option>)}</select>
            <span style={{fontSize:11,color:TEXT_MUTED}}>to</span>
            <select value={endMonth} onChange={e=>setEndMonth(+e.target.value)} style={selectStyle}>{MONTH_KEYS.filter(m=>m.index>=startMonth).map(m=><option key={m.index} value={m.index}>{m.label}</option>)}</select>
            {[["MTD",11,11],["QTD",9,11],["YTD",6,11],["ALL",0,11]].map(([l,s,e])=>(<button key={l} onClick={()=>{setStartMonth(s);setEndMonth(e);}} style={{padding:"4px 9px",borderRadius:6,border:`1px solid ${startMonth===s&&endMonth===e?GOLD:BORDER}`,background:startMonth===s&&endMonth===e?`${GOLD}18`:"transparent",color:startMonth===s&&endMonth===e?GOLD:TEXT_MUTED,fontSize:10,fontWeight:600,cursor:"pointer"}}>{l}</button>))}
            <div style={{display:"flex",alignItems:"center",gap:4,marginLeft:4}}><div style={{width:6,height:6,borderRadius:3,background:SUCCESS,animation:"pulse 2s infinite"}}/><span style={{fontSize:10,color:TEXT_MUTED}}>Live</span></div>
          </div>
        </header>

        <main style={{padding:"18px 24px 40px",overflow:"auto",flex:1}}>
          {view==="ceo"&&<CEOView {...{filteredRevenue,filteredServiceRev,filteredGeoRev,segTotals,totalSegRev,svcTotals,totalRevenue,revGrowth,avgMargin,avgUtil,totalOps,deployedOps,benchOps,benchCost}}/>}
          {view==="cso"&&<CSOView {...{activePL,weightedPL,winRate,wonDeals,lostDeals}}/>}
          {view==="finance"&&<FinanceView {...{filteredRevenue,filteredPnl,totalRevenue,revGrowth,avgUtil,totalOps,deployedOps,benchOps,benchCost,weightedPL,activePL}}/>}
          {view==="contracts"&&<ContractsView periodStart={MONTHS[startMonth]} periodEnd={MONTHS[endMonth]}/>}
          {view==="close"&&<MonthlyCloseView/>}
          {view==="dataroom"&&<DataRoomView/>}
          {view==="opsmap"&&<OpsTheaterView/>}
        </main>
      </div>
    </div>
  );
}

// ═══════ CEO VIEW ═══════
function CEOView({filteredRevenue,filteredServiceRev,filteredGeoRev,segTotals,totalSegRev,svcTotals,totalRevenue,revGrowth,avgMargin,avgUtil,totalOps,deployedOps,benchOps,benchCost}){
  const[cSort,setCSort]=useState("annualRev");const[cDir,setCDir]=useState("desc");
  const sorted=useMemo(()=>[...CLIENTS].sort((a,b)=>cDir==="desc"?b[cSort]-a[cSort]:a[cSort]-b[cSort]),[cSort,cDir]);
  const hs=(f)=>{if(cSort===f)setCDir(d=>d==="desc"?"asc":"desc");else{setCSort(f);setCDir("desc");}};

  return(<div style={{display:"flex",flexDirection:"column",gap:18}}>
    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
      <KPICard icon={DollarSign} label="Total Revenue" value={fmt(totalRevenue)} trend={`+${revGrowth}%`} trendDir="up"/>
      <KPICard icon={TrendingUp} label="Blended Margin" value={`${avgMargin}%`} trend="+3.2pp" trendDir="up" accent={SUCCESS}/>
      <KPICard icon={Users} label="Deployment" value={`${deployedOps}/${totalOps}`} trend={`${avgUtil}%`} trendDir="up" accent={INFO}/>
      <KPICard icon={AlertTriangle} label="Bench Cost/Day" value={`$${benchCost.toLocaleString()}`} trend={`${benchOps} idle`} trendDir="down" accent={DANGER}/>
    </div>
    <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
      <Card style={{flex:2,minWidth:340}}><SH title="Revenue Trend by Segment" subtitle="Monthly ($K) stacked"/>
        <ResponsiveContainer width="100%" height={260}><AreaChart data={filteredRevenue}><defs>{Object.entries(SEGMENT_COLORS).map(([s,c])=>(<linearGradient key={s} id={`g-${s.replace(/\s/g,"")}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c} stopOpacity={0.4}/><stop offset="100%" stopColor={c} stopOpacity={0.05}/></linearGradient>))}</defs><CartesianGrid stroke={BORDER} strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fill:TEXT_MUTED,fontSize:10}} axisLine={{stroke:BORDER}} tickLine={false}/><YAxis tick={{fill:TEXT_MUTED,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}K`}/><Tooltip content={<CustomTooltip formatter={v=>`$${v}K`}/>}/>{Object.entries(SEGMENT_COLORS).map(([s,c])=>(<Area key={s} type="monotone" dataKey={s} stackId="1" stroke={c} fill={`url(#g-${s.replace(/\s/g,"")})`} strokeWidth={1.5}/>))}</AreaChart></ResponsiveContainer>
      </Card>
      <Card style={{flex:1,minWidth:260}}><SH title="Segment Mix"/>
        <ResponsiveContainer width="100%" height={180}><PieChart><Pie data={segTotals} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={3} dataKey="value" stroke="none">{segTotals.map((d,i)=><Cell key={i} fill={SEGMENT_COLORS[d.name]}/>)}</Pie><Tooltip content={<CustomTooltip formatter={v=>`$${v}K`}/>}/></PieChart></ResponsiveContainer>
        <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:4}}>{segTotals.map(d=>(<div key={d.name} style={{display:"flex",justifyContent:"space-between",fontSize:11}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:7,height:7,borderRadius:2,background:SEGMENT_COLORS[d.name]}}/><span style={{color:TEXT_SECONDARY}}>{d.name}</span></div><span style={{color:TEXT_PRIMARY,fontWeight:600}}>{fmt(d.value)} <span style={{color:TEXT_MUTED,fontSize:10}}>({Math.round(d.value/totalSegRev*100)}%)</span></span></div>))}</div>
      </Card>
    </div>
    <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
      <Card style={{flex:1,minWidth:300}}><SH title="Revenue by Service Line"/>
        <ResponsiveContainer width="100%" height={200}><BarChart data={svcTotals} layout="vertical" barSize={18}><CartesianGrid stroke={BORDER} strokeDasharray="3 3" horizontal={false}/><XAxis type="number" tick={{fill:TEXT_MUTED,fontSize:10}} tickFormatter={v=>`$${v}K`} axisLine={false} tickLine={false}/><YAxis type="category" dataKey="name" tick={{fill:TEXT_SECONDARY,fontSize:11}} axisLine={false} tickLine={false} width={125}/><Tooltip content={<CustomTooltip formatter={v=>`$${v}K`}/>}/><Bar dataKey="value" radius={[0,6,6,0]}>{svcTotals.map((d,i)=><Cell key={i} fill={SERVICE_COLORS[d.name]}/>)}</Bar></BarChart></ResponsiveContainer>
      </Card>
      <Card style={{flex:1,minWidth:300}}><SH title="Revenue by Geography"/>
        <ResponsiveContainer width="100%" height={200}><BarChart data={Object.keys(GEO_COLORS).map(g=>({name:g,value:filteredGeoRev.reduce((s,r)=>s+(r[g]||0),0)}))} layout="vertical" barSize={18}><CartesianGrid stroke={BORDER} strokeDasharray="3 3" horizontal={false}/><XAxis type="number" tick={{fill:TEXT_MUTED,fontSize:10}} tickFormatter={v=>`$${v}K`} axisLine={false} tickLine={false}/><YAxis type="category" dataKey="name" tick={{fill:TEXT_SECONDARY,fontSize:11}} axisLine={false} tickLine={false} width={100}/><Tooltip content={<CustomTooltip formatter={v=>`$${v}K`}/>}/><Bar dataKey="value" radius={[0,6,6,0]}>{Object.values(GEO_COLORS).map((c,i)=><Cell key={i} fill={c}/>)}</Bar></BarChart></ResponsiveContainer>
      </Card>
    </div>
    {/* CLIENT CONCENTRATION RISK */}
    <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
      <Card style={{flex:1,minWidth:300}}>
        <SH title="Client Concentration Risk" subtitle="Revenue concentration in top accounts"/>
        {(()=>{const sortedC=[...CLIENTS].sort((a,b)=>b.annualRev-a.annualRev);const totalCR=CLIENTS.reduce((s,c)=>s+c.annualRev,0);const top3=sortedC.slice(0,3).reduce((s,c)=>s+c.annualRev,0);const top5=sortedC.slice(0,5).reduce((s,c)=>s+c.annualRev,0);const top3p=Math.round(top3/totalCR*100);const top5p=Math.round(top5/totalCR*100);const riskColor=top3p>40?DANGER:top3p>30?WARNING:SUCCESS;return(<div>
          <div style={{display:"flex",gap:12,marginBottom:16}}>
            <div style={{flex:1,padding:"12px 14px",background:`${riskColor}10`,borderRadius:8,border:`1px solid ${riskColor}25`}}>
              <div style={{fontSize:10,color:TEXT_MUTED,fontWeight:600,letterSpacing:1,textTransform:"uppercase"}}>Top 3 Clients</div>
              <div style={{fontSize:24,fontWeight:700,color:riskColor,fontFamily:"'Cormorant Garamond',serif"}}>{top3p}%</div>
              <div style={{fontSize:10,color:TEXT_SECONDARY}}>{fmt(top3)} of {fmt(totalCR)}</div>
            </div>
            <div style={{flex:1,padding:"12px 14px",background:`${WARNING}10`,borderRadius:8,border:`1px solid ${WARNING}25`}}>
              <div style={{fontSize:10,color:TEXT_MUTED,fontWeight:600,letterSpacing:1,textTransform:"uppercase"}}>Top 5 Clients</div>
              <div style={{fontSize:24,fontWeight:700,color:WARNING,fontFamily:"'Cormorant Garamond',serif"}}>{top5p}%</div>
              <div style={{fontSize:10,color:TEXT_SECONDARY}}>{fmt(top5)} of {fmt(totalCR)}</div>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>{sortedC.slice(0,5).map((c,i)=>{const pct=Math.round(c.annualRev/totalCR*100);return(
            <div key={i}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:11,color:GOLD,fontWeight:700,width:16}}>{i+1}.</span><span style={{color:TEXT_PRIMARY,fontSize:12,fontWeight:500}}>{c.name}</span></div><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{color:TEXT_SECONDARY,fontSize:11}}>{fmt(c.annualRev)}</span><span style={{color:GOLD,fontSize:11,fontWeight:700}}>{pct}%</span></div></div>
            <div style={{width:"100%",height:6,background:BORDER,borderRadius:3,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:i<3?GOLD:`${GOLD}80`,borderRadius:3}}/></div></div>
          );})}</div>
        </div>);})()}
      </Card>
      <Card style={{flex:1,minWidth:300}}>
        <SH title="Revenue per Operator" subtitle="Monthly revenue generated per deployed operator, by segment"/>
        <ResponsiveContainer width="100%" height={220}><BarChart data={UTILIZATION.map(u=>{const segRev=CLIENTS.filter(c=>c.segment===u.segment).reduce((s,c)=>s+c.annualRev,0);return{segment:u.segment.split(" ").slice(0,2).join(" "),revPerOp:u.deployed>0?Math.round(segRev/u.deployed/12):0,deployed:u.deployed};})} barSize={22}>
          <CartesianGrid stroke={BORDER} strokeDasharray="3 3"/><XAxis dataKey="segment" tick={{fill:TEXT_MUTED,fontSize:9}} axisLine={false} tickLine={false} interval={0} angle={-10} textAnchor="end" height={45}/><YAxis tick={{fill:TEXT_MUTED,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}K`}/><Tooltip content={<CustomTooltip formatter={v=>`$${v}K/mo`}/>}/><Bar dataKey="revPerOp" name="Rev/Operator/Mo" fill={GOLD} radius={[5,5,0,0]}/>
        </BarChart></ResponsiveContainer>
        {(()=>{const totalRev=CLIENTS.reduce((s,c)=>s+c.annualRev,0);const totalDep=UTILIZATION.reduce((s,u)=>s+u.deployed,0);const avgRevPerOp=Math.round(totalRev/totalDep/12);return(<div style={{marginTop:8,padding:"10px 14px",background:`${GOLD}08`,borderRadius:8,border:`1px solid ${GOLD}20`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:TEXT_SECONDARY,fontSize:12}}>Company Average</span><span style={{color:GOLD,fontSize:18,fontWeight:700,fontFamily:"'Cormorant Garamond',serif"}}>${avgRevPerOp}K<span style={{fontSize:11,color:TEXT_MUTED,fontWeight:400}}>/operator/month</span></span></div>);})()}
      </Card>
    </div>
    <Card><SH title="Headcount & Utilization by Segment"/>
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"separate",borderSpacing:0,fontSize:12}}><thead><tr>{["Segment","Deployed","Bench","Training","Total","Utilization"].map(h=>(<th key={h} style={{padding:"8px 12px",textAlign:h==="Segment"?"left":"center",color:TEXT_MUTED,fontWeight:600,fontSize:10,letterSpacing:1,textTransform:"uppercase",borderBottom:`1px solid ${BORDER}`}}>{h}</th>))}</tr></thead><tbody>{UTILIZATION.map((u,i)=>{const t=u.deployed+u.bench+u.training;const uc=u.utilization>=85?SUCCESS:u.utilization>=70?WARNING:DANGER;return(<tr key={i}><td style={{padding:"10px 12px",display:"flex",alignItems:"center",gap:8}}><div style={{width:7,height:7,borderRadius:2,background:SEGMENT_COLORS[u.segment]}}/><span style={{color:TEXT_PRIMARY,fontWeight:500}}>{u.segment}</span></td><td style={{padding:"10px 12px",textAlign:"center",color:SUCCESS,fontWeight:600}}>{u.deployed}</td><td style={{padding:"10px 12px",textAlign:"center",color:DANGER,fontWeight:600}}>{u.bench}</td><td style={{padding:"10px 12px",textAlign:"center",color:INFO,fontWeight:600}}>{u.training}</td><td style={{padding:"10px 12px",textAlign:"center",color:TEXT_PRIMARY,fontWeight:600}}>{t}</td><td style={{padding:"10px 12px",textAlign:"center"}}><div style={{display:"flex",alignItems:"center",gap:6,justifyContent:"center"}}><div style={{width:55,height:5,background:BORDER,borderRadius:3,overflow:"hidden"}}><div style={{width:`${u.utilization}%`,height:"100%",background:uc,borderRadius:3}}/></div><span style={{color:uc,fontWeight:600,fontSize:11}}>{u.utilization}%</span></div></td></tr>);})}</tbody></table></div>
    </Card>
    <Card><SH title="Revenue by Client" subtitle="Click headers to sort"/>
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"separate",borderSpacing:0,fontSize:12}}><thead><tr>{[["Client",null],["Segment",null],["Geo",null],["Service",null],["Annual Rev","annualRev"],["Margin","margin"],["Ops","operators"]].map(([h,f])=>(<th key={h} onClick={()=>f&&hs(f)} style={{padding:"8px 12px",textAlign:f?"center":"left",color:cSort===f?GOLD:TEXT_MUTED,fontWeight:600,fontSize:10,letterSpacing:1,textTransform:"uppercase",borderBottom:`1px solid ${BORDER}`,cursor:f?"pointer":"default",userSelect:"none",whiteSpace:"nowrap"}}>{h}{f&&cSort===f?(cDir==="desc"?" ↓":" ↑"):""}</th>))}</tr></thead>
      <tbody>{sorted.map((c,i)=>{const mc=c.margin>=50?SUCCESS:c.margin>=40?WARNING:DANGER;return(<tr key={i} onMouseEnter={e=>e.currentTarget.style.background=BG_CARD_HOVER} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><td style={{padding:"10px 12px",color:TEXT_PRIMARY,fontWeight:600,whiteSpace:"nowrap"}}>{c.name}</td><td style={{padding:"10px 12px"}}><div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:6,height:6,borderRadius:2,background:SEGMENT_COLORS[c.segment]}}/><span style={{color:TEXT_SECONDARY,fontSize:11}}>{c.segment}</span></div></td><td style={{padding:"10px 12px",color:TEXT_SECONDARY,fontSize:11}}>{c.geo}</td><td style={{padding:"10px 12px",color:TEXT_SECONDARY,fontSize:11}}>{c.service}</td><td style={{padding:"10px 12px",textAlign:"center",color:GOLD,fontWeight:700}}>{fmt(c.annualRev)}</td><td style={{padding:"10px 12px",textAlign:"center"}}><span style={{color:mc,fontWeight:600,background:`${mc}15`,padding:"2px 7px",borderRadius:4,fontSize:11}}>{c.margin}%</span></td><td style={{padding:"10px 12px",textAlign:"center",color:TEXT_PRIMARY,fontWeight:600}}>{c.operators}</td></tr>);})}</tbody>
      <tfoot><tr style={{borderTop:`2px solid ${GOLD}40`}}><td style={{padding:"10px 12px",color:GOLD,fontWeight:700}} colSpan={4}>TOTAL ({CLIENTS.length})</td><td style={{padding:"10px 12px",textAlign:"center",color:GOLD,fontWeight:700}}>{fmt(CLIENTS.reduce((s,c)=>s+c.annualRev,0))}</td><td style={{padding:"10px 12px",textAlign:"center",color:GOLD,fontWeight:700}}>{avgMargin}%</td><td style={{padding:"10px 12px",textAlign:"center",color:GOLD,fontWeight:700}}>{CLIENTS.reduce((s,c)=>s+c.operators,0)}</td></tr></tfoot></table></div>
    </Card>
  </div>);
}

// ═══════ CSO VIEW (ENHANCED) ═══════
function CSOView({activePL,weightedPL,winRate,wonDeals,lostDeals}){
  const totalPV=activePL.reduce((s,d)=>s+d.value,0);
  const[pipeTab,setPipeTab]=useState("active");

  // Stage funnel for active deals
  const stageOrder=["First Contact","Discovery Call","Proposal Sent","Contract Negotiation"];
  const funnelData=stageOrder.map(stage=>{const deals=PIPELINE.filter(p=>p.stage===stage);return{stage,count:deals.length,value:deals.reduce((s,d)=>s+d.value,0)};});

  // Bookings
  const bookingsMap={};activePL.forEach(d=>{bookingsMap[d.expectedClose]=(bookingsMap[d.expectedClose]||0)+Math.round(d.value*d.probability/100);});
  const bookingsData=Object.entries(bookingsMap).sort((a,b)=>a[0].localeCompare(b[0])).map(([m,v])=>({month:m,value:v}));

  // Loss reasons
  const lossReasonMap={};lostDeals.forEach(d=>{const r=d.lossReason||"Unknown";lossReasonMap[r]=(lossReasonMap[r]||0)+1;});
  const lossReasonData=Object.entries(lossReasonMap).map(([r,c])=>({reason:r,count:c,value:lostDeals.filter(d=>d.lossReason===r).reduce((s,d)=>s+d.value,0)})).sort((a,b)=>b.count-a.count);
  const totalLostValue=lostDeals.reduce((s,d)=>s+d.value,0);

  // Pipeline by segment donut
  const segPD={};activePL.forEach(d=>{segPD[d.segment]=(segPD[d.segment]||0)+d.value;});
  const segPipeData=Object.entries(segPD).map(([n,v])=>({name:n,value:v})).sort((a,b)=>b.value-a.value);

  const displayPipeline = pipeTab==="active"?PIPELINE.filter(p=>!["Closed-Won","Closed-Lost"].includes(p.stage)):pipeTab==="won"?wonDeals:lostDeals;

  return(<div style={{display:"flex",flexDirection:"column",gap:18}}>
    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
      <KPICard icon={Target} label="Active Pipeline" value={fmt(totalPV)} sub={`${activePL.length} opportunities`}/>
      <KPICard icon={DollarSign} label="Weighted Pipeline" value={fmt(Math.round(weightedPL))} sub="Probability-adjusted" accent={SUCCESS}/>
      <KPICard icon={CheckCircle} label="Win Rate" value={`${winRate}%`} sub={`${wonDeals.length}W / ${lostDeals.length}L of ${wonDeals.length+lostDeals.length} decided`} accent={winRate>=50?SUCCESS:WARNING}/>
      <KPICard icon={XCircle} label="Lost Revenue" value={fmt(totalLostValue)} sub={`${lostDeals.length} lost deals`} accent={DANGER}/>
    </div>

    <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
      {/* FUNNEL */}
      <Card style={{flex:1,minWidth:300}}>
        <SH title="Pipeline Stage Funnel" subtitle="Active deals by stage progression"/>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:8}}>
          {funnelData.map((d,idx)=>{const mx=Math.max(...funnelData.map(f=>f.value),1);const pct=d.value/mx*100;const col=STAGE_COLORS_NEW[d.stage]||TEXT_MUTED;return(
            <div key={d.stage}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:20,height:20,borderRadius:6,background:`${col}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:col}}>{idx+1}</div>
                  <span style={{color:TEXT_SECONDARY,fontSize:12,fontWeight:500}}>{d.stage}</span>
                </div>
                <div style={{display:"flex",gap:12,alignItems:"center"}}><span style={{color:TEXT_MUTED,fontSize:11}}>{d.count} deals</span><span style={{color:TEXT_PRIMARY,fontSize:12,fontWeight:700}}>{fmt(d.value)}</span></div>
              </div>
              <div style={{width:"100%",height:26,background:`${BORDER}60`,borderRadius:6,overflow:"hidden"}}>
                <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${col},${col}88)`,borderRadius:6,display:"flex",alignItems:"center",paddingLeft:8,minWidth:40}}>
                  <span style={{fontSize:9,color:"#fff",fontWeight:700}}>{fmt(d.value)}</span>
                </div>
              </div>
            </div>
          );})}
        </div>
      </Card>

      {/* BOOKINGS */}
      <Card style={{flex:1,minWidth:300}}>
        <SH title="Anticipated Bookings" subtitle="Weighted expected closes by month"/>
        <ResponsiveContainer width="100%" height={200}><BarChart data={bookingsData} barSize={28}><CartesianGrid stroke={BORDER} strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fill:TEXT_MUTED,fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:TEXT_MUTED,fontSize:10}} tickFormatter={v=>`$${v}K`} axisLine={false} tickLine={false}/><Tooltip content={<CustomTooltip formatter={v=>`$${v}K`}/>}/><Bar dataKey="value" fill={GOLD} radius={[5,5,0,0]} name="Weighted"/></BarChart></ResponsiveContainer>
      </Card>
    </div>

    {/* WIN/LOSS ANALYSIS */}
    <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
      <Card style={{flex:1,minWidth:280}}>
        <SH title="Win/Loss Analysis" subtitle="Decided deals breakdown"/>
        <div style={{display:"flex",gap:20,alignItems:"center",marginBottom:16}}>
          <div style={{flex:1}}>
            <ResponsiveContainer width="100%" height={140}><PieChart><Pie data={[{name:"Won",value:wonDeals.length},{name:"Lost",value:lostDeals.length}]} cx="50%" cy="50%" innerRadius={35} outerRadius={58} paddingAngle={4} dataKey="value" stroke="none"><Cell fill={SUCCESS}/><Cell fill={DANGER}/></Pie></PieChart></ResponsiveContainer>
          </div>
          <div style={{flex:1}}>
            <div style={{marginBottom:10}}><div style={{fontSize:11,color:TEXT_MUTED}}>Won</div><div style={{display:"flex",alignItems:"baseline",gap:6}}><span style={{fontSize:24,fontWeight:700,color:SUCCESS,fontFamily:"'Cormorant Garamond',serif"}}>{wonDeals.length}</span><span style={{fontSize:11,color:TEXT_SECONDARY}}>deals / {fmt(wonDeals.reduce((s,d)=>s+d.value,0))}</span></div></div>
            <div><div style={{fontSize:11,color:TEXT_MUTED}}>Lost</div><div style={{display:"flex",alignItems:"baseline",gap:6}}><span style={{fontSize:24,fontWeight:700,color:DANGER,fontFamily:"'Cormorant Garamond',serif"}}>{lostDeals.length}</span><span style={{fontSize:11,color:TEXT_SECONDARY}}>deals / {fmt(totalLostValue)}</span></div></div>
          </div>
        </div>
      </Card>

      <Card style={{flex:1,minWidth:280}}>
        <SH title="Loss Reasons" subtitle="Why deals were lost"/>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {lossReasonData.map((r,i)=>{const pct=Math.round(r.count/lostDeals.length*100);return(
            <div key={i}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{color:TEXT_SECONDARY,fontSize:12}}>{r.reason}</span>
                <div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{color:TEXT_MUTED,fontSize:11}}>{r.count} deal{r.count>1?"s":""}</span><span style={{color:DANGER,fontSize:12,fontWeight:600}}>{fmt(r.value)}</span></div>
              </div>
              <div style={{width:"100%",height:8,background:`${BORDER}60`,borderRadius:4,overflow:"hidden"}}>
                <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${DANGER},${DANGER}88)`,borderRadius:4}}/>
              </div>
              <div style={{fontSize:10,color:TEXT_MUTED,textAlign:"right",marginTop:2}}>{pct}% of losses</div>
            </div>
          );})}
        </div>
      </Card>

      <Card style={{flex:1,minWidth:260}}>
        <SH title="Pipeline by Segment"/>
        <ResponsiveContainer width="100%" height={140}><PieChart><Pie data={segPipeData} cx="50%" cy="50%" innerRadius={35} outerRadius={58} paddingAngle={3} dataKey="value" stroke="none">{segPipeData.map((d,i)=><Cell key={i} fill={SEGMENT_COLORS[d.name]||TEXT_MUTED}/>)}</Pie><Tooltip content={<CustomTooltip formatter={v=>`$${v}K`}/>}/></PieChart></ResponsiveContainer>
        <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:4}}>{segPipeData.map(d=>(<div key={d.name} style={{display:"flex",justifyContent:"space-between",fontSize:11}}><div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:7,height:7,borderRadius:2,background:SEGMENT_COLORS[d.name]}}/><span style={{color:TEXT_SECONDARY}}>{d.name}</span></div><span style={{color:TEXT_PRIMARY,fontWeight:600}}>{fmt(d.value)}</span></div>))}</div>
      </Card>
    </div>

    {/* PIPELINE TABLE WITH TABS */}
    <Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
        <SH title="Pipeline Detail" subtitle="All opportunities with stage tracking"/>
        <div style={{display:"flex",gap:3}}>
          {[["active","Active",activePL.length],["won","Won",wonDeals.length],["lost","Lost",lostDeals.length]].map(([k,l,c])=>(<button key={k} onClick={()=>setPipeTab(k)} style={{padding:"5px 12px",borderRadius:6,border:`1px solid ${pipeTab===k?GOLD:BORDER}`,background:pipeTab===k?`${GOLD}18`:"transparent",color:pipeTab===k?GOLD:TEXT_MUTED,fontSize:11,fontWeight:600,cursor:"pointer"}}>{l} ({c})</button>))}
        </div>
      </div>
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"separate",borderSpacing:0,fontSize:12}}>
        <thead><tr>{["Prospect","Contact","Stage","Service","Value",pipeTab==="lost"?"Loss Reason":"Probability","Next Step","Close"].map(h=>(<th key={h} style={{padding:"8px 12px",textAlign:["Value","Probability"].includes(h)?"center":"left",color:TEXT_MUTED,fontWeight:600,fontSize:10,letterSpacing:1,textTransform:"uppercase",borderBottom:`1px solid ${BORDER}`,whiteSpace:"nowrap"}}>{h}</th>))}</tr></thead>
        <tbody>{displayPipeline.map((d,i)=>{const col=STAGE_COLORS_NEW[d.stage]||TEXT_MUTED;return(<tr key={i} onMouseEnter={e=>e.currentTarget.style.background=BG_CARD_HOVER} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <td style={{padding:"9px 12px"}}><div style={{color:TEXT_PRIMARY,fontWeight:600,fontSize:12}}>{d.client}</div><div style={{color:TEXT_MUTED,fontSize:10}}>{d.segment}</div></td>
          <td style={{padding:"9px 12px",color:TEXT_SECONDARY,fontSize:11,whiteSpace:"nowrap"}}>{d.contact}</td>
          <td style={{padding:"9px 12px"}}><span style={{background:`${col}20`,color:col,padding:"3px 10px",borderRadius:10,fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>{d.stage}</span></td>
          <td style={{padding:"9px 12px",color:TEXT_SECONDARY,fontSize:11}}>{d.service}</td>
          <td style={{padding:"9px 12px",textAlign:"center",color:TEXT_PRIMARY,fontWeight:600}}>{fmt(d.value)}</td>
          <td style={{padding:"9px 12px",textAlign:pipeTab==="lost"?"left":"center",color:pipeTab==="lost"?DANGER:d.probability>=50?SUCCESS:d.probability>=25?WARNING:TEXT_MUTED,fontWeight:600,fontSize:11}}>{pipeTab==="lost"?(d.lossReason||"-"):`${d.probability}%`}</td>
          <td style={{padding:"9px 12px",color:TEXT_SECONDARY,fontSize:11,maxWidth:180}}>{d.nextStep}</td>
          <td style={{padding:"9px 12px",color:TEXT_SECONDARY,fontSize:11,whiteSpace:"nowrap"}}>{d.expectedClose}</td>
        </tr>);})}</tbody>
      </table></div>
    </Card>
  </div>);
}

// ═══════ FINANCE VIEW ═══════
function FinanceView({filteredRevenue,filteredPnl,totalRevenue,revGrowth,avgUtil,totalOps,deployedOps,benchOps,benchCost,weightedPL,activePL}){
  const pGM=filteredPnl.reduce((s,r)=>s+r.grossMargin,0);const pGMp=Math.round(pGM/totalRevenue*100);
  const pOP=filteredPnl.reduce((s,r)=>s+r.operatingProfit,0);const pOPp=Math.round(pOP/totalRevenue*100);
  const pCoS=filteredPnl.reduce((s,r)=>s+r.costOfService,0);const pSM=filteredPnl.reduce((s,r)=>s+r.salesMarketing,0);const pGA=filteredPnl.reduce((s,r)=>s+r.gAndA,0);
  const pOC=filteredPnl.reduce((s,r)=>s+r.operatorComp,0);const pOD=filteredPnl.reduce((s,r)=>s+r.otherDirect,0);
  const bRev=filteredPnl.reduce((s,r)=>s+r.budgetRev,0);const bCoS=filteredPnl.reduce((s,r)=>s+r.budgetCoS,0);const bGM=filteredPnl.reduce((s,r)=>s+r.budgetGM,0);const bSM=filteredPnl.reduce((s,r)=>s+r.budgetSM,0);const bGA=filteredPnl.reduce((s,r)=>s+r.budgetGA,0);const bOP=filteredPnl.reduce((s,r)=>s+r.budgetOP,0);
  const payrollPct=Math.round(pOC/totalRevenue*100);
  const dso=Math.round(TOTAL_AR/(totalRevenue/filteredPnl.length)*30);const dpo=Math.round(TOTAL_AP/(pCoS/filteredPnl.length)*30);const runway=Math.round(CASH_BALANCE/(pGA/filteredPnl.length));
  const totalCliRev=CLIENTS.reduce((s,c)=>s+c.annualRev,0);const avgRevPerOp=Math.round(totalCliRev/deployedOps/12);

  return(<div style={{display:"flex",flexDirection:"column",gap:18}}>
    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
      <KPICard icon={DollarSign} label="Revenue" value={fmt(totalRevenue)} trend={`+${revGrowth}%`} trendDir="up" small/>
      <KPICard icon={TrendingUp} label="Gross Margin" value={`${pGMp}%`} sub={fmt(pGM)} trend="+2.1pp" trendDir="up" accent={SUCCESS} small/>
      <KPICard icon={Landmark} label="Operating Profit" value={`${pOPp}%`} sub={fmt(pOP)} accent={pOPp>=10?SUCCESS:WARNING} small/>
      <KPICard icon={Wallet} label="Cash in Bank" value={`$${(CASH_BALANCE/1000).toFixed(1)}M`} sub={`Credit: $${CREDIT_LINE-CREDIT_DRAWN}K avail`} accent={INFO} small/>
      <KPICard icon={Users} label="Rev / Operator" value={`$${avgRevPerOp}K`} sub={`${deployedOps} deployed | ${payrollPct}% payroll ratio`} accent={GOLD} small/>
    </div>

    <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
      <Card style={{flex:2,minWidth:380}}><SH title="P&L Summary" subtitle="Monthly trend ($K)"/>
        <ResponsiveContainer width="100%" height={280}><ComposedChart data={filteredPnl}><CartesianGrid stroke={BORDER} strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fill:TEXT_MUTED,fontSize:10}} axisLine={{stroke:BORDER}} tickLine={false}/><YAxis tick={{fill:TEXT_MUTED,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}K`}/><Tooltip content={<CustomTooltip formatter={v=>`$${v}K`}/>}/><Legend wrapperStyle={{fontSize:10}}/><Bar dataKey="operatorComp" name="Operator Comp" fill={`${DANGER}70`} stackId="c" barSize={22}/><Bar dataKey="otherDirect" name="Other Direct" fill={`${DANGER}35`} stackId="c" barSize={22}/><Bar dataKey="salesMarketing" name="S&M" fill={`${WARNING}60`} stackId="c" barSize={22}/><Bar dataKey="gAndA" name="G&A" fill={`${INFO}50`} stackId="c" barSize={22} radius={[3,3,0,0]}/><Line type="monotone" dataKey="revenue" name="Revenue" stroke={GOLD} strokeWidth={2.5} dot={{r:3,fill:GOLD}}/><Line type="monotone" dataKey="budgetRev" name="Budget" stroke={TEXT_MUTED} strokeWidth={1.5} strokeDasharray="6 3" dot={false}/><Line type="monotone" dataKey="operatingProfit" name="Op Profit" stroke={SUCCESS} strokeWidth={2} strokeDasharray="4 2" dot={{r:3,fill:SUCCESS}}/></ComposedChart></ResponsiveContainer>
      </Card>
      <Card style={{flex:1,minWidth:280}}><SH title="P&L: Actual vs. Budget" subtitle={`${filteredPnl.length} months`}/>
        <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"separate",borderSpacing:0,fontSize:11}}>
          <thead><tr>{["","Actual","Budget","Var $","Var %"].map(h=>(<th key={h} style={{padding:"6px 8px",textAlign:h===""?"left":"right",color:TEXT_MUTED,fontWeight:600,fontSize:9,letterSpacing:1,textTransform:"uppercase",borderBottom:`1px solid ${BORDER}`}}>{h}</th>))}</tr></thead>
          <tbody>{[
            {l:"Revenue",a:totalRevenue,b:bRev,color:GOLD,bold:true},
            {l:"  Operator Comp",a:-pOC,b:Math.round(-bCoS*0.78),color:DANGER,indent:true},
            {l:"  Other Direct",a:-pOD,b:Math.round(-bCoS*0.22),color:DANGER,indent:true},
            {l:"Cost of Service",a:-pCoS,b:-bCoS,color:DANGER},
            {l:"Gross Margin",a:pGM,b:bGM,color:SUCCESS,bold:true,pct:true},
            {l:"Sales & Marketing",a:-pSM,b:-bSM,color:WARNING,indent:true},
            {l:"General & Admin",a:-pGA,b:-bGA,color:INFO,indent:true},
            {l:"Operating Profit",a:pOP,b:bOP,color:pOPp>=10?SUCCESS:WARNING,bold:true,pct:true,border:true},
          ].map((r,i)=>{const varD=r.a-r.b;const varP=r.b!==0?Math.round(varD/Math.abs(r.b)*100):0;const favorable=(r.bold&&!r.indent)?varD>=0:varD<=0;const vc=favorable?SUCCESS:DANGER;return(
            <tr key={i} style={{borderTop:r.border?`2px solid ${GOLD}40`:"none"}}>
              <td style={{padding:"6px 8px",color:r.bold?TEXT_PRIMARY:TEXT_SECONDARY,fontWeight:r.bold?700:400,fontSize:r.bold?12:11,paddingLeft:r.indent?20:8}}>{r.l}</td>
              <td style={{padding:"6px 8px",textAlign:"right",color:r.color,fontWeight:r.bold?700:600,fontSize:r.bold?12:11}}>{r.a<0?`(${fmt(Math.abs(r.a))})`:`${fmt(r.a)}`}</td>
              <td style={{padding:"6px 8px",textAlign:"right",color:TEXT_MUTED,fontSize:11}}>{r.b<0?`(${fmt(Math.abs(r.b))})`:`${fmt(r.b)}`}</td>
              <td style={{padding:"6px 8px",textAlign:"right",color:vc,fontWeight:600,fontSize:11}}>{varD>=0?"+":""}{fmt(varD)}</td>
              <td style={{padding:"6px 8px",textAlign:"right"}}><span style={{color:vc,fontSize:10,fontWeight:600,background:`${vc}15`,padding:"1px 5px",borderRadius:3}}>{varP>=0?"+":""}{varP}%</span></td>
            </tr>
          );})}</tbody>
        </table></div>
        {/* Payroll ratio callout */}
        <div style={{marginTop:12,padding:"10px 12px",background:`${GOLD}08`,borderRadius:8,border:`1px solid ${GOLD}20`}}>
          <div style={{fontSize:10,color:TEXT_MUTED,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Operator Compensation</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={{color:TEXT_SECONDARY,fontSize:11}}>% of Revenue</span>
            <span style={{color:payrollPct>45?DANGER:payrollPct>40?WARNING:SUCCESS,fontSize:16,fontWeight:700,fontFamily:"'Cormorant Garamond',serif"}}>{payrollPct}%</span>
          </div>
          <div style={{width:"100%",height:8,background:BORDER,borderRadius:4,overflow:"hidden"}}>
            <div style={{width:`${payrollPct}%`,height:"100%",background:payrollPct>45?DANGER:payrollPct>40?WARNING:SUCCESS,borderRadius:4}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:9,color:TEXT_MUTED}}><span>Target: &lt;40%</span><span>{fmt(pOC)} of {fmt(totalRevenue)}</span></div>
        </div>
      </Card>
    </div>

    {/* PAYROLL & REV PER OPERATOR */}
    <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
      <Card style={{flex:1,minWidth:300}}><SH title="Cost of Service Breakdown" subtitle="Operator compensation vs. other direct costs ($K)"/>
        <ResponsiveContainer width="100%" height={220}><ComposedChart data={filteredPnl}><CartesianGrid stroke={BORDER} strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fill:TEXT_MUTED,fontSize:10}} axisLine={{stroke:BORDER}} tickLine={false}/><YAxis yAxisId="l" tick={{fill:TEXT_MUTED,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}K`}/><YAxis yAxisId="r" orientation="right" tick={{fill:TEXT_MUTED,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/><Tooltip content={<CustomTooltip formatter={v=>`$${v}K`}/>}/><Legend wrapperStyle={{fontSize:10}}/><Bar yAxisId="l" dataKey="operatorComp" name="Operator Comp" fill={`${DANGER}70`} stackId="s" barSize={20}/><Bar yAxisId="l" dataKey="otherDirect" name="Other Direct" fill={`${WARNING}50`} stackId="s" barSize={20} radius={[3,3,0,0]}/><Line yAxisId="r" type="monotone" dataKey="payrollPct" name="Payroll %" stroke={GOLD} strokeWidth={2} dot={{r:3,fill:GOLD}}/></ComposedChart></ResponsiveContainer>
      </Card>
      <Card style={{flex:1,minWidth:300}}><SH title="Revenue per Operator by Segment" subtitle="Monthly revenue generated per deployed operator"/>
        <ResponsiveContainer width="100%" height={220}><BarChart data={UTILIZATION.map(u=>{const segRev=CLIENTS.filter(c=>c.segment===u.segment).reduce((s,c)=>s+c.annualRev,0);return{segment:u.segment.split(" ").slice(0,2).join(" "),revPerOp:u.deployed>0?Math.round(segRev/u.deployed/12):0};})} barSize={24}>
          <CartesianGrid stroke={BORDER} strokeDasharray="3 3"/><XAxis dataKey="segment" tick={{fill:TEXT_MUTED,fontSize:9}} axisLine={false} tickLine={false} interval={0} angle={-10} textAnchor="end" height={45}/><YAxis tick={{fill:TEXT_MUTED,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}K`}/><Tooltip content={<CustomTooltip formatter={v=>`$${v}K/mo per operator`}/>}/><Bar dataKey="revPerOp" name="Rev/Operator/Mo" fill={GOLD} radius={[5,5,0,0]}/>
          <ReferenceLine y={avgRevPerOp} stroke={SUCCESS} strokeDasharray="6 3" label={{value:`Avg $${avgRevPerOp}K`,fill:SUCCESS,fontSize:10,position:"right"}}/>
        </BarChart></ResponsiveContainer>
      </Card>
    </div>

    <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
      <Card style={{flex:1,minWidth:300}}><SH title="Revenue vs. Budget"/>
        <ResponsiveContainer width="100%" height={220}><AreaChart data={filteredPnl}><defs><linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={GOLD} stopOpacity={0.3}/><stop offset="100%" stopColor={GOLD} stopOpacity={0.05}/></linearGradient></defs><CartesianGrid stroke={BORDER} strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fill:TEXT_MUTED,fontSize:10}} axisLine={{stroke:BORDER}} tickLine={false}/><YAxis tick={{fill:TEXT_MUTED,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}K`}/><Tooltip content={<CustomTooltip formatter={v=>`$${v}K`}/>}/><Area type="monotone" dataKey="revenue" name="Actual" stroke={GOLD} fill="url(#gRev)" strokeWidth={2}/><Line type="monotone" dataKey="budgetRev" name="Budget" stroke={TEXT_MUTED} strokeWidth={1.5} strokeDasharray="6 3" dot={false}/></AreaChart></ResponsiveContainer>
      </Card>
      <Card style={{flex:1,minWidth:300}}><SH title="Utilization & Bench Economics"/>
        <ResponsiveContainer width="100%" height={220}><BarChart data={UTILIZATION} barSize={20}><CartesianGrid stroke={BORDER} strokeDasharray="3 3"/><XAxis dataKey="segment" tick={{fill:TEXT_MUTED,fontSize:9}} axisLine={false} tickLine={false} interval={0} angle={-15} textAnchor="end" height={50}/><YAxis tick={{fill:TEXT_MUTED,fontSize:10}} axisLine={false} tickLine={false}/><Tooltip content={<CustomTooltip/>}/><Legend wrapperStyle={{fontSize:10}}/><Bar dataKey="deployed" name="Deployed" fill={SUCCESS} stackId="a"/><Bar dataKey="bench" name="Bench" fill={DANGER} stackId="a"/><Bar dataKey="training" name="Training" fill={INFO} stackId="a" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer>
      </Card>
    </div>

    {/* AR/AP */}
    <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
      <Card style={{flex:1.2,minWidth:340}}><SH title="Accounts Receivable Aging" subtitle={`Total: ${fmt(TOTAL_AR)} | DSO: ${dso} days`}/>
        <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"separate",borderSpacing:0,fontSize:12}}><thead><tr>{["Client","Current","1-30","31-60","61-90","Total"].map(h=>(<th key={h} style={{padding:"8px 10px",textAlign:h==="Client"?"left":"center",color:TEXT_MUTED,fontWeight:600,fontSize:10,letterSpacing:1,textTransform:"uppercase",borderBottom:`1px solid ${BORDER}`}}>{h}</th>))}</tr></thead>
        <tbody>{AR_AGING.map((r,i)=>(<tr key={i} onMouseEnter={e=>e.currentTarget.style.background=BG_CARD_HOVER} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><td style={{padding:"8px 10px"}}><div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:6,height:6,borderRadius:2,background:SEGMENT_COLORS[r.segment]}}/><span style={{color:TEXT_PRIMARY,fontWeight:500,fontSize:11}}>{r.client}</span></div></td><td style={{padding:"8px 10px",textAlign:"center",color:SUCCESS,fontWeight:600,fontSize:11}}>{r.current>0?`$${r.current}K`:"-"}</td><td style={{padding:"8px 10px",textAlign:"center",color:WARNING,fontWeight:600,fontSize:11}}>{r.days30>0?`$${r.days30}K`:"-"}</td><td style={{padding:"8px 10px",textAlign:"center",color:DANGER,fontWeight:600,fontSize:11}}>{r.days60>0?`$${r.days60}K`:"-"}</td><td style={{padding:"8px 10px",textAlign:"center",color:"#EF4444",fontWeight:700,fontSize:11}}>{r.days90>0?`$${r.days90}K`:"-"}</td><td style={{padding:"8px 10px",textAlign:"center",color:TEXT_PRIMARY,fontWeight:700,fontSize:11}}>${r.total}K</td></tr>))}</tbody>
        <tfoot><tr style={{borderTop:`2px solid ${GOLD}40`}}><td style={{padding:"8px 10px",color:GOLD,fontWeight:700}}>TOTAL</td>{[AR_AGING.reduce((s,r)=>s+r.current,0),AR_AGING.reduce((s,r)=>s+r.days30,0),AR_AGING.reduce((s,r)=>s+r.days60,0),AR_AGING.reduce((s,r)=>s+r.days90,0),TOTAL_AR].map((v,i)=>(<td key={i} style={{padding:"8px 10px",textAlign:"center",color:GOLD,fontWeight:700}}>{i===4?fmt(v):`$${v}K`}</td>))}</tr></tfoot></table></div>
      </Card>
      <Card style={{flex:0.8,minWidth:280}}><SH title="Accounts Payable" subtitle={`Total: ${fmt(TOTAL_AP)} | DPO: ${dpo} days`}/>
        <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"separate",borderSpacing:0,fontSize:12}}><thead><tr>{["Category","Current","1-30","31-60","Total"].map(h=>(<th key={h} style={{padding:"8px 10px",textAlign:h==="Category"?"left":"center",color:TEXT_MUTED,fontWeight:600,fontSize:10,letterSpacing:1,textTransform:"uppercase",borderBottom:`1px solid ${BORDER}`}}>{h}</th>))}</tr></thead>
        <tbody>{AP_SUMMARY.map((r,i)=>(<tr key={i}><td style={{padding:"8px 10px",color:TEXT_PRIMARY,fontWeight:500,fontSize:11}}>{r.category}</td><td style={{padding:"8px 10px",textAlign:"center",color:TEXT_SECONDARY,fontSize:11}}>${r.current}K</td><td style={{padding:"8px 10px",textAlign:"center",color:r.days30>0?WARNING:TEXT_MUTED,fontSize:11}}>{r.days30>0?`$${r.days30}K`:"-"}</td><td style={{padding:"8px 10px",textAlign:"center",color:r.days60>0?DANGER:TEXT_MUTED,fontSize:11}}>{r.days60>0?`$${r.days60}K`:"-"}</td><td style={{padding:"8px 10px",textAlign:"center",color:TEXT_PRIMARY,fontWeight:600,fontSize:11}}>${r.total}K</td></tr>))}</tbody>
        <tfoot><tr style={{borderTop:`2px solid ${GOLD}40`}}><td style={{padding:"8px 10px",color:GOLD,fontWeight:700}}>TOTAL</td>{[AP_SUMMARY.reduce((s,r)=>s+r.current,0),AP_SUMMARY.reduce((s,r)=>s+r.days30,0),AP_SUMMARY.reduce((s,r)=>s+r.days60,0),TOTAL_AP].map((v,i)=>(<td key={i} style={{padding:"8px 10px",textAlign:"center",color:GOLD,fontWeight:700}}>{i===3?fmt(v):`$${v}K`}</td>))}</tr></tfoot></table></div>
        <div style={{marginTop:14,padding:12,background:`${GOLD}08`,borderRadius:8,border:`1px solid ${GOLD}20`}}><div style={{fontSize:10,color:TEXT_MUTED,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Net Working Capital</div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:TEXT_SECONDARY,fontSize:12}}>AR - AP</span><span style={{color:GOLD,fontSize:20,fontWeight:700,fontFamily:"'Cormorant Garamond',serif"}}>{fmt(TOTAL_AR-TOTAL_AP)}</span></div></div>
      </Card>
    </div>

    {/* 13 WEEK */}
    <Card><SH title="13-Week Cash Forecast" subtitle={`Starting: $${(CASH_BALANCE/1000).toFixed(1)}M | Credit: $${CREDIT_LINE}K ($${CREDIT_LINE-CREDIT_DRAWN}K avail)`}/>
      <ResponsiveContainer width="100%" height={260}><ComposedChart data={WEEKLY_FORECAST}><defs><linearGradient id="gC" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={INFO} stopOpacity={0.3}/><stop offset="100%" stopColor={INFO} stopOpacity={0.05}/></linearGradient></defs><CartesianGrid stroke={BORDER} strokeDasharray="3 3"/><XAxis dataKey="week" tick={{fill:TEXT_MUTED,fontSize:10}} axisLine={{stroke:BORDER}} tickLine={false}/><YAxis yAxisId="b" tick={{fill:TEXT_MUTED,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}K`}/><YAxis yAxisId="l" orientation="right" tick={{fill:TEXT_MUTED,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}K`}/><Tooltip content={<CustomTooltip formatter={v=>`$${v}K`}/>}/><Legend wrapperStyle={{fontSize:10}}/><Bar yAxisId="b" dataKey="inflow" name="Inflow" fill={`${SUCCESS}70`} barSize={14} radius={[3,3,0,0]}/><Bar yAxisId="b" dataKey="outflow" name="Outflow" fill={`${DANGER}60`} barSize={14} radius={[3,3,0,0]}/><Area yAxisId="l" type="monotone" dataKey="balance" name="Balance" stroke={INFO} fill="url(#gC)" strokeWidth={2.5}/><ReferenceLine yAxisId="l" y={1500} stroke={WARNING} strokeDasharray="8 4" strokeWidth={1.5} label={{value:"Min Bal",fill:WARNING,fontSize:10,position:"right"}}/></ComposedChart></ResponsiveContainer>
      <div style={{overflowX:"auto",marginTop:10}}><table style={{width:"100%",borderCollapse:"separate",borderSpacing:0,fontSize:11}}><thead><tr>{["Wk","Date","In","Out","Net","Balance"].map(h=>(<th key={h} style={{padding:"5px 10px",textAlign:h==="Wk"||h==="Date"?"left":"center",color:TEXT_MUTED,fontWeight:600,fontSize:9,letterSpacing:1,textTransform:"uppercase",borderBottom:`1px solid ${BORDER}`}}>{h}</th>))}</tr></thead><tbody>{WEEKLY_FORECAST.map((w,i)=>{const dz=w.balance<1500;return(<tr key={i} style={{background:dz?`${DANGER}08`:"transparent"}}><td style={{padding:"5px 10px",color:TEXT_PRIMARY,fontWeight:600}}>{w.week}</td><td style={{padding:"5px 10px",color:TEXT_SECONDARY}}>{w.date}</td><td style={{padding:"5px 10px",textAlign:"center",color:SUCCESS}}>${w.inflow}K</td><td style={{padding:"5px 10px",textAlign:"center",color:DANGER}}>${w.outflow}K</td><td style={{padding:"5px 10px",textAlign:"center",color:w.net>=0?SUCCESS:DANGER,fontWeight:600}}>{w.net>=0?"+":""}${w.net}K</td><td style={{padding:"5px 10px",textAlign:"center",fontWeight:700,color:dz?DANGER:GOLD}}>${w.balance.toLocaleString()}K{dz?" ⚠":""}</td></tr>);})}</tbody></table></div>
    </Card>

    {/* BOTTOM METRICS */}
    <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
      <Card style={{flex:1,minWidth:200}}><div style={{display:"flex",flexDirection:"column",gap:8}}>{[{l:"Cash in Bank",v:`$${(CASH_BALANCE/1000).toFixed(1)}M`,c:INFO,icon:Wallet},{l:"Credit Line",v:`$${CREDIT_LINE}K`,c:TEXT_SECONDARY,icon:CreditCard},{l:"Credit Drawn",v:`($${CREDIT_DRAWN}K)`,c:WARNING,icon:TrendingDown},{l:"Available Liquidity",v:`$${((CASH_BALANCE+CREDIT_LINE-CREDIT_DRAWN)/1000).toFixed(1)}M`,c:SUCCESS,icon:Landmark}].map((r,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<3?`1px solid ${BORDER}`:"none"}}><div style={{display:"flex",alignItems:"center",gap:8}}><r.icon size={14} color={r.c}/><span style={{color:TEXT_SECONDARY,fontSize:12}}>{r.l}</span></div><span style={{color:r.c,fontWeight:700,fontSize:14,fontFamily:"'Cormorant Garamond',serif"}}>{r.v}</span></div>))}</div></Card>
      <Card style={{flex:1,minWidth:200}}><SH title="Key Finance Metrics"/><div style={{display:"flex",flexDirection:"column",gap:8}}>{[{l:"DSO",v:`${dso} days`,t:"Target: <45",ok:dso<=45},{l:"DPO",v:`${dpo} days`,t:"Target: >30",ok:dpo>=30},{l:"Cash Conversion Cycle",v:`${dso-dpo} days`,t:"Target: <20",ok:(dso-dpo)<=20},{l:"G&A Runway",v:`${runway} mo`,t:"Target: >6",ok:runway>6}].map((r,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<3?`1px solid ${BORDER}`:"none"}}><div><div style={{color:TEXT_SECONDARY,fontSize:12}}>{r.l}</div>{r.t&&<div style={{color:TEXT_MUTED,fontSize:10}}>{r.t}</div>}</div><span style={{color:r.ok?SUCCESS:WARNING,fontWeight:700,fontSize:14,fontFamily:"'Cormorant Garamond',serif"}}>{r.v}</span></div>))}</div></Card>
      <Card style={{flex:1,minWidth:200}}><SH title="Forward Revenue Visibility"/><div style={{display:"flex",flexDirection:"column",gap:8}}>{[{l:"Contracted ARR",v:fmt(CLIENTS.reduce((s,c)=>s+c.annualRev,0)),c:GOLD},{l:"Weighted Pipeline",v:fmt(Math.round(weightedPL)),c:SUCCESS},{l:"Total Visibility",v:fmt(CLIENTS.reduce((s,c)=>s+c.annualRev,0)+Math.round(weightedPL)),c:GOLD},{l:"Pipeline Coverage",v:`${(activePL.reduce((s,d)=>s+d.value,0)/(CLIENTS.reduce((s,c)=>s+c.annualRev,0)/2)*100).toFixed(0)}%`,c:INFO,sub:"Pipeline / 6mo Rev"}].map((r,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<3?`1px solid ${BORDER}`:"none"}}><div><div style={{color:TEXT_SECONDARY,fontSize:12}}>{r.l}</div>{r.sub&&<div style={{color:TEXT_MUTED,fontSize:10}}>{r.sub}</div>}</div><span style={{color:r.c,fontWeight:700,fontSize:14,fontFamily:"'Cormorant Garamond',serif"}}>{r.v}</span></div>))}</div></Card>
    </div>
  </div>);
}

// ═══════ CONTRACTS VIEW ═══════
function ContractsView({periodStart,periodEnd}){
  const[tab,setTab]=useState("clients");
  const typeColors={"Retainer":GOLD,"Project":INFO,"IDIQ":SUCCESS};

  // Filter contracts active during selected period (start overlaps end)
  const activeClientContracts=useMemo(()=>CLIENT_CONTRACTS.filter(c=>periodOverlap(c.startDate,c.endDate,periodStart,periodEnd)),[periodStart,periodEnd]);
  const activeVendorContracts=useMemo(()=>VENDOR_CONTRACTS.filter(v=>periodOverlap(v.startDate,v.endDate,periodStart,periodEnd)),[periodStart,periodEnd]);

  // Contracts expiring within selected window
  const clientRenewals=activeClientContracts.filter(c=>inPeriod(c.endDate,periodStart,periodEnd)||c.status==="Renewal Due");
  const vendorRenewals=activeVendorContracts.filter(v=>inPeriod(v.endDate,periodStart,periodEnd)||v.status==="Renewal Due");

  const totalContractValue=activeClientContracts.reduce((s,c)=>s+c.annualValue,0);
  const totalVendorMonthly=activeVendorContracts.reduce((s,v)=>s+v.monthlyValue,0);

  // Contract type breakdown (filtered)
  const typeBreakdown={};activeClientContracts.forEach(c=>{typeBreakdown[c.type]=(typeBreakdown[c.type]||0)+c.annualValue;});
  const typeData=Object.entries(typeBreakdown).map(([n,v])=>({name:n,value:v}));

  // Vendor by category (filtered)
  const vendorCatMap={};activeVendorContracts.forEach(v=>{const cat=v.category.split(" - ")[0];vendorCatMap[cat]=(vendorCatMap[cat]||0)+v.monthlyValue*12;});
  const vendorCatData=Object.entries(vendorCatMap).map(([n,v])=>({name:n,value:v})).sort((a,b)=>b.value-a.value);

  // Dynamic status: "Expiring" if end date falls within selected period, else original status
  const getStatus=(item)=>{if(inPeriod(item.endDate,periodStart,periodEnd))return"Expiring";return item.status;};
  const statusColor=(s)=>s==="Expiring"||s==="Renewal Due"?WARNING:SUCCESS;

  return(<div style={{display:"flex",flexDirection:"column",gap:18}}>
    {/* Period context banner */}
    <div style={{background:`${GOLD}08`,border:`1px solid ${GOLD}20`,borderRadius:10,padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
      <div style={{fontSize:12,color:TEXT_SECONDARY}}>Showing contracts active during <span style={{color:GOLD,fontWeight:700}}>{periodStart}</span> through <span style={{color:GOLD,fontWeight:700}}>{periodEnd}</span></div>
      <div style={{fontSize:11,color:TEXT_MUTED}}>Contracts that started before or during, and end during or after, this window</div>
    </div>

    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
      <KPICard icon={FileCheck} label="Active Client Contracts" value={activeClientContracts.length} sub={`${fmt(totalContractValue)} annual value`}/>
      <KPICard icon={AlertTriangle} label="Expiring / Renewal Due" value={clientRenewals.length} sub="Within selected period" accent={clientRenewals.length>0?WARNING:SUCCESS}/>
      <KPICard icon={Scale} label="Vendor Agreements" value={activeVendorContracts.length} sub={`$${totalVendorMonthly}K/mo | ${fmt(totalVendorMonthly*12)}/yr`} accent={INFO}/>
      <KPICard icon={AlertTriangle} label="Vendor Renewals" value={vendorRenewals.length} sub="Expiring in period" accent={vendorRenewals.length>0?WARNING:SUCCESS}/>
    </div>

    <div style={{display:"flex",gap:3}}>
      {[["clients",`Client Contracts (${activeClientContracts.length})`],["vendors",`Vendor Agreements (${activeVendorContracts.length})`]].map(([k,l])=>(<button key={k} onClick={()=>setTab(k)} style={{padding:"8px 20px",borderRadius:8,border:`1px solid ${tab===k?GOLD:BORDER}`,background:tab===k?`${GOLD}15`:"transparent",color:tab===k?GOLD:TEXT_MUTED,fontSize:12,fontWeight:600,cursor:"pointer"}}>{l}</button>))}
    </div>

    {tab==="clients"&&<>
      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
        <Card style={{flex:1,minWidth:260}}><SH title="Contract Value by Type" subtitle="Active in period"/>
          {typeData.length>0?<><ResponsiveContainer width="100%" height={160}><PieChart><Pie data={typeData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" stroke="none">{typeData.map((d,i)=><Cell key={i} fill={typeColors[d.name]||TEXT_MUTED}/>)}</Pie><Tooltip content={<CustomTooltip formatter={v=>`$${v}K`}/>}/></PieChart></ResponsiveContainer>
          <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:6}}>{typeData.map(d=>(<div key={d.name} style={{display:"flex",justifyContent:"space-between",fontSize:11}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:7,height:7,borderRadius:2,background:typeColors[d.name]||TEXT_MUTED}}/><span style={{color:TEXT_SECONDARY}}>{d.name}</span></div><span style={{color:TEXT_PRIMARY,fontWeight:600}}>{fmt(d.value)}</span></div>))}</div></>
          :<div style={{padding:30,textAlign:"center",color:TEXT_MUTED,fontSize:12}}>No contracts active in selected period</div>}
        </Card>
        <Card style={{flex:2,minWidth:340}}><SH title="Renewals & Expirations" subtitle={`Contracts expiring or due for renewal ${periodStart} - ${periodEnd}`}/>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {clientRenewals.length===0?<div style={{padding:20,textAlign:"center",color:SUCCESS,fontSize:12}}><CheckCircle size={20} style={{marginBottom:6}}/><br/>No contracts expiring in this period</div>
            :clientRenewals.sort((a,b)=>(parseMS(a.endDate)||0)-(parseMS(b.endDate)||0)).map((c,i)=>{const isUrgent=getStatus(c)!=="Active";return(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:isUrgent?`${WARNING}08`:BG_CARD_HOVER,borderRadius:8,border:isUrgent?`1px solid ${WARNING}30`:`1px solid ${BORDER}`}}>
                <div><div style={{color:TEXT_PRIMARY,fontWeight:600,fontSize:12}}>{c.client}</div><div style={{color:TEXT_MUTED,fontSize:10}}>{c.service} | {c.type} | {fmt(c.annualValue)}/yr</div></div>
                <div style={{textAlign:"right"}}><div style={{color:isUrgent?WARNING:TEXT_SECONDARY,fontWeight:600,fontSize:11}}>Expires {c.endDate}</div><div style={{fontSize:10,color:isUrgent?WARNING:TEXT_MUTED}}>{c.notice} notice | {c.autoRenew?"Auto-renew":"Manual renewal"}</div></div>
              </div>
            );})}
          </div>
        </Card>
      </div>

      <Card><SH title="Client Contract Register" subtitle={`${activeClientContracts.length} contracts active during ${periodStart} - ${periodEnd}`}/>
        {activeClientContracts.length===0?<div style={{padding:30,textAlign:"center",color:TEXT_MUTED,fontSize:12}}>No client contracts active during the selected period. Try expanding the date range.</div>
        :<div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"separate",borderSpacing:0,fontSize:12}}>
          <thead><tr>{["Client","Type","Service","Start","End","Annual Value","Terms","Auto-Renew","Notice","Status"].map(h=>(<th key={h} style={{padding:"8px 10px",textAlign:["Annual Value"].includes(h)?"center":"left",color:TEXT_MUTED,fontWeight:600,fontSize:10,letterSpacing:1,textTransform:"uppercase",borderBottom:`1px solid ${BORDER}`,whiteSpace:"nowrap"}}>{h}</th>))}</tr></thead>
          <tbody>{activeClientContracts.map((c,i)=>{const st=getStatus(c);const urgent=st!=="Active";return(<tr key={i} onMouseEnter={e=>e.currentTarget.style.background=BG_CARD_HOVER} onMouseLeave={e=>e.currentTarget.style.background="transparent"} style={{background:urgent?`${WARNING}06`:"transparent"}}>
            <td style={{padding:"8px 10px",color:TEXT_PRIMARY,fontWeight:600,whiteSpace:"nowrap"}}>{c.client}</td>
            <td style={{padding:"8px 10px"}}><span style={{background:`${(typeColors[c.type]||TEXT_MUTED)}20`,color:typeColors[c.type]||TEXT_MUTED,padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:700}}>{c.type}</span></td>
            <td style={{padding:"8px 10px",color:TEXT_SECONDARY,fontSize:11}}>{c.service}</td>
            <td style={{padding:"8px 10px",color:TEXT_SECONDARY,fontSize:11,whiteSpace:"nowrap"}}>{c.startDate}</td>
            <td style={{padding:"8px 10px",color:urgent?WARNING:TEXT_SECONDARY,fontSize:11,fontWeight:urgent?600:400,whiteSpace:"nowrap"}}>{c.endDate}</td>
            <td style={{padding:"8px 10px",textAlign:"center",color:GOLD,fontWeight:700}}>{fmt(c.annualValue)}</td>
            <td style={{padding:"8px 10px",color:TEXT_SECONDARY,fontSize:11}}>{c.terms}</td>
            <td style={{padding:"8px 10px",textAlign:"center"}}>{c.autoRenew?<CheckCircle size={14} color={SUCCESS}/>:<XCircle size={14} color={TEXT_MUTED}/>}</td>
            <td style={{padding:"8px 10px",color:TEXT_SECONDARY,fontSize:11}}>{c.notice}</td>
            <td style={{padding:"8px 10px"}}><span style={{background:`${statusColor(st)}20`,color:statusColor(st),padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:700}}>{st}</span></td>
          </tr>);})}</tbody>
          <tfoot><tr style={{borderTop:`2px solid ${GOLD}40`}}><td colSpan={5} style={{padding:"8px 10px",color:GOLD,fontWeight:700}}>TOTAL ({activeClientContracts.length} contracts)</td><td style={{padding:"8px 10px",textAlign:"center",color:GOLD,fontWeight:700}}>{fmt(totalContractValue)}</td><td colSpan={4}/></tr></tfoot>
        </table></div>}
      </Card>
    </>}

    {tab==="vendors"&&<>
      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
        <Card style={{flex:1,minWidth:260}}><SH title="Vendor Spend by Category" subtitle="Active in period, annualized"/>
          {vendorCatData.length>0?<ResponsiveContainer width="100%" height={200}><BarChart data={vendorCatData} layout="vertical" barSize={16}><CartesianGrid stroke={BORDER} strokeDasharray="3 3" horizontal={false}/><XAxis type="number" tick={{fill:TEXT_MUTED,fontSize:10}} tickFormatter={v=>`$${v}K`} axisLine={false} tickLine={false}/><YAxis type="category" dataKey="name" tick={{fill:TEXT_SECONDARY,fontSize:10}} axisLine={false} tickLine={false} width={90}/><Tooltip content={<CustomTooltip formatter={v=>`$${v}K`}/>}/><Bar dataKey="value" fill={INFO} radius={[0,6,6,0]}/></BarChart></ResponsiveContainer>
          :<div style={{padding:30,textAlign:"center",color:TEXT_MUTED,fontSize:12}}>No vendor agreements active in selected period</div>}
        </Card>
        <Card style={{flex:1,minWidth:260}}><SH title="Vendor Renewal Alerts" subtitle={`Expiring ${periodStart} - ${periodEnd}`}/>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {vendorRenewals.length===0?
              <div style={{padding:20,textAlign:"center",color:SUCCESS,fontSize:12}}><CheckCircle size={20} style={{marginBottom:6}}/><br/>No vendor contracts expiring in this period</div>
            :vendorRenewals.map((v,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:`${WARNING}08`,borderRadius:8,border:`1px solid ${WARNING}30`}}>
                <div><div style={{color:TEXT_PRIMARY,fontWeight:600,fontSize:12}}>{v.vendor}</div><div style={{color:TEXT_MUTED,fontSize:10}}>{v.category}</div></div>
                <div style={{textAlign:"right"}}><div style={{color:WARNING,fontWeight:600,fontSize:11}}>{v.endDate}</div><div style={{fontSize:10,color:TEXT_MUTED}}>${v.monthlyValue}K/mo | {v.notice} notice</div></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card><SH title="Vendor Agreement Register" subtitle={`${activeVendorContracts.length} agreements active during ${periodStart} - ${periodEnd}`}/>
        {activeVendorContracts.length===0?<div style={{padding:30,textAlign:"center",color:TEXT_MUTED,fontSize:12}}>No vendor agreements active during the selected period.</div>
        :<div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"separate",borderSpacing:0,fontSize:12}}>
          <thead><tr>{["Vendor","Category","Monthly","Annual","Start","End","Terms","Auto-Renew","Notice","Status"].map(h=>(<th key={h} style={{padding:"8px 10px",textAlign:["Monthly","Annual"].includes(h)?"center":"left",color:TEXT_MUTED,fontWeight:600,fontSize:10,letterSpacing:1,textTransform:"uppercase",borderBottom:`1px solid ${BORDER}`,whiteSpace:"nowrap"}}>{h}</th>))}</tr></thead>
          <tbody>{activeVendorContracts.map((v,i)=>{const st=getStatus(v);const urgent=st!=="Active";return(<tr key={i} onMouseEnter={e=>e.currentTarget.style.background=BG_CARD_HOVER} onMouseLeave={e=>e.currentTarget.style.background="transparent"} style={{background:urgent?`${WARNING}06`:"transparent"}}>
            <td style={{padding:"8px 10px",color:TEXT_PRIMARY,fontWeight:600,whiteSpace:"nowrap"}}>{v.vendor}</td>
            <td style={{padding:"8px 10px",color:TEXT_SECONDARY,fontSize:11}}>{v.category}</td>
            <td style={{padding:"8px 10px",textAlign:"center",color:TEXT_PRIMARY,fontWeight:600}}>${v.monthlyValue}K</td>
            <td style={{padding:"8px 10px",textAlign:"center",color:GOLD,fontWeight:700}}>{fmt(v.monthlyValue*12)}</td>
            <td style={{padding:"8px 10px",color:TEXT_SECONDARY,fontSize:11,whiteSpace:"nowrap"}}>{v.startDate}</td>
            <td style={{padding:"8px 10px",color:urgent?WARNING:TEXT_SECONDARY,fontSize:11,fontWeight:urgent?600:400,whiteSpace:"nowrap"}}>{v.endDate}</td>
            <td style={{padding:"8px 10px",color:TEXT_SECONDARY,fontSize:11}}>{v.terms}</td>
            <td style={{padding:"8px 10px",textAlign:"center"}}>{v.autoRenew?<CheckCircle size={14} color={SUCCESS}/>:<XCircle size={14} color={TEXT_MUTED}/>}</td>
            <td style={{padding:"8px 10px",color:TEXT_SECONDARY,fontSize:11}}>{v.notice}</td>
            <td style={{padding:"8px 10px"}}><span style={{background:`${statusColor(st)}20`,color:statusColor(st),padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:700}}>{st}</span></td>
          </tr>);})}</tbody>
          <tfoot><tr style={{borderTop:`2px solid ${GOLD}40`}}><td colSpan={2} style={{padding:"8px 10px",color:GOLD,fontWeight:700}}>TOTAL ({activeVendorContracts.length})</td><td style={{padding:"8px 10px",textAlign:"center",color:GOLD,fontWeight:700}}>${totalVendorMonthly}K</td><td style={{padding:"8px 10px",textAlign:"center",color:GOLD,fontWeight:700}}>{fmt(totalVendorMonthly*12)}</td><td colSpan={6}/></tr></tfoot>
        </table></div>}
      </Card>
    </>}
  </div>);
}

// ═══════ MONTHLY CLOSE VIEW ═══════
function MonthlyCloseView(){
  const[selectedMonth,setSelectedMonth]=useState(11);
  const mc=MONTHLY_CLOSE[selectedMonth];
  const pnl=mc.pnl;
  const prevMc=selectedMonth>0?MONTHLY_CLOSE[selectedMonth-1]:null;
  const alertColors={warning:WARNING,danger:DANGER,info:INFO};
  const typeColors2={"Retainer":GOLD,"Project":INFO,"IDIQ":SUCCESS};

  return(<div style={{display:"flex",flexDirection:"column",gap:18}}>
    {/* MONTH GRID */}
    <Card><SH title="Monthly Close Calendar" subtitle="Select a month to view the complete close package"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:8}}>
        {MONTHLY_CLOSE.map((m,i)=>{const active=i===selectedMonth;const closeNum=parseInt(m.closeDate.split(" ")[1]||"10");const fast=closeNum<=8;return(
          <button key={i} onClick={()=>setSelectedMonth(i)} style={{padding:"12px 8px",borderRadius:10,border:`1px solid ${active?GOLD:BORDER}`,background:active?`${GOLD}15`:BG_CARD,cursor:"pointer",transition:"all 0.2s",textAlign:"center",position:"relative",overflow:"hidden"}}>
            {active&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:GOLD}}/>}
            <div style={{fontSize:13,fontWeight:700,color:active?GOLD:TEXT_PRIMARY,fontFamily:"'Cormorant Garamond',serif"}}>{m.month.split(" ")[0]}</div>
            <div style={{fontSize:10,color:TEXT_MUTED}}>{m.month.split(" ")[1]}</div>
            <div style={{marginTop:6,display:"flex",justifyContent:"center",gap:4}}>
              <div style={{width:6,height:6,borderRadius:3,background:fast?SUCCESS:WARNING}} title={`Closed ${m.closeDate}`}/>
              <div style={{width:6,height:6,borderRadius:3,background:m.alerts.some(a=>a.type==="danger")?DANGER:SUCCESS}} title="Alerts"/>
            </div>
            <div style={{fontSize:9,color:TEXT_MUTED,marginTop:4}}>Closed {m.closeDate.split(",")[0].split(" ")[1]}<sup>th</sup></div>
          </button>
        );})}
      </div>
    </Card>

    {/* SELECTED MONTH HEADER */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
      <div><span style={{fontSize:22,fontWeight:700,color:GOLD,fontFamily:"'Cormorant Garamond',serif"}}>{mc.month}</span><span style={{fontSize:12,color:TEXT_MUTED,marginLeft:12}}>Close completed: <span style={{color:SUCCESS,fontWeight:600}}>{mc.closeDate}</span></span></div>
      <div style={{display:"flex",gap:6}}>{mc.alerts.map((a,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",background:`${alertColors[a.type]}10`,border:`1px solid ${alertColors[a.type]}30`,borderRadius:8}}>
          <AlertTriangle size={12} color={alertColors[a.type]}/>
          <span style={{fontSize:10,color:alertColors[a.type],fontWeight:500,maxWidth:200,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{a.text}</span>
        </div>
      ))}</div>
    </div>

    {/* KPI TILES */}
    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
      <KPICard icon={DollarSign} label="Revenue" value={fmt(pnl.revenue)} trend={prevMc?`${((pnl.revenue/prevMc.pnl.revenue-1)*100).toFixed(1)}%`:""} trendDir="up" small/>
      <KPICard icon={TrendingUp} label="Gross Margin" value={`${pnl.grossMarginPct}%`} sub={fmt(pnl.grossMargin)} accent={SUCCESS} small/>
      <KPICard icon={Landmark} label="Op Profit" value={`${pnl.opMarginPct}%`} sub={fmt(pnl.operatingProfit)} accent={pnl.opMarginPct>=10?SUCCESS:WARNING} small/>
      <KPICard icon={Wallet} label="Cash" value={fmt(mc.cashBal)} accent={INFO} small/>
      <KPICard icon={Users} label="Headcount" value={mc.totalEmp} sub={`${mc.billableEmp} billable`} accent={GOLD} small/>
      <KPICard icon={Activity} label="Utilization" value={`${mc.util}%`} accent={mc.util>=80?SUCCESS:WARNING} small/>
    </div>

    {/* P&L + BALANCE SHEET */}
    <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
      <Card style={{flex:1,minWidth:260}}><SH title="Income Statement" subtitle={mc.month}/>
        <div style={{display:"flex",flexDirection:"column",gap:1}}>{[
          {l:"Revenue",v:pnl.revenue,c:GOLD,bold:true},
          {l:"  Operator Compensation",v:-pnl.operatorComp,c:DANGER,in:true},
          {l:"  Other Direct Costs",v:-pnl.otherDirect,c:DANGER,in:true},
          {l:"Cost of Service",v:-pnl.costOfService,c:DANGER},
          {l:"Gross Margin",v:pnl.grossMargin,c:SUCCESS,bold:true,pct:pnl.grossMarginPct},
          {l:"Sales & Marketing",v:-pnl.salesMarketing,c:WARNING,in:true},
          {l:"General & Admin",v:-pnl.gAndA,c:INFO,in:true},
          {l:"Operating Profit",v:pnl.operatingProfit,c:pnl.opMarginPct>=10?SUCCESS:WARNING,bold:true,pct:pnl.opMarginPct,bdr:true},
        ].map((r,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:r.bold?"8px 0":"5px 0",borderTop:r.bdr?`2px solid ${GOLD}40`:i>0?`1px solid ${BORDER}`:"none",paddingLeft:r.in?16:0}}>
          <span style={{color:r.bold?TEXT_PRIMARY:TEXT_SECONDARY,fontWeight:r.bold?700:400,fontSize:r.bold?12:11}}>{r.l}</span>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{color:r.c,fontWeight:700,fontSize:r.bold?13:11,fontFamily:r.bold?"'Cormorant Garamond',serif":"inherit"}}>{r.v<0?`(${fmt(Math.abs(r.v))})`:`${fmt(r.v)}`}</span>
            {r.pct!==undefined&&<span style={{color:TEXT_MUTED,fontSize:9,background:`${r.c}15`,padding:"1px 5px",borderRadius:3}}>{r.pct}%</span>}
          </div>
        </div>))}</div>
      </Card>

      <Card style={{flex:1,minWidth:260}}><SH title="Balance Sheet" subtitle={`As of ${mc.month} month-end`}/>
        <div style={{display:"flex",flexDirection:"column",gap:1}}>
          <div style={{padding:"6px 0",color:GOLD,fontWeight:700,fontSize:11,letterSpacing:1,textTransform:"uppercase"}}>Assets</div>
          {[{l:"Cash & Equivalents",v:mc.cashBal,c:INFO},{l:"Accounts Receivable",v:mc.ar,c:SUCCESS},{l:"Prepaid Expenses",v:mc.prepaid,c:TEXT_SECONDARY},{l:"Fixed Assets (Net)",v:mc.fixedAssets,c:TEXT_SECONDARY}].map((r,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0 4px 12px",borderBottom:`1px solid ${BORDER}`}}><span style={{color:TEXT_SECONDARY,fontSize:11}}>{r.l}</span><span style={{color:r.c,fontWeight:600,fontSize:11}}>{fmt(r.v)}</span></div>))}
          <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${BORDER}`}}><span style={{color:TEXT_PRIMARY,fontWeight:700,fontSize:12}}>Total Assets</span><span style={{color:GOLD,fontWeight:700,fontSize:12}}>{fmt(mc.totalAssets)}</span></div>

          <div style={{padding:"8px 0 4px",color:GOLD,fontWeight:700,fontSize:11,letterSpacing:1,textTransform:"uppercase"}}>Liabilities</div>
          {[{l:"Accounts Payable",v:mc.ap,c:DANGER},{l:"Accrued Liabilities",v:mc.accrued,c:WARNING},{l:"Debt / Credit Line",v:mc.debt,c:TEXT_SECONDARY}].map((r,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0 4px 12px",borderBottom:`1px solid ${BORDER}`}}><span style={{color:TEXT_SECONDARY,fontSize:11}}>{r.l}</span><span style={{color:r.c,fontWeight:600,fontSize:11}}>{fmt(r.v)}</span></div>))}
          <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${BORDER}`}}><span style={{color:TEXT_PRIMARY,fontWeight:700,fontSize:12}}>Total Liabilities</span><span style={{color:DANGER,fontWeight:700,fontSize:12}}>{fmt(mc.totalLiab)}</span></div>

          <div style={{padding:"8px 0 4px",color:GOLD,fontWeight:700,fontSize:11,letterSpacing:1,textTransform:"uppercase"}}>Equity</div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}><span style={{color:TEXT_PRIMARY,fontWeight:700,fontSize:12}}>Stockholders' Equity</span><span style={{color:SUCCESS,fontWeight:700,fontSize:13,fontFamily:"'Cormorant Garamond',serif"}}>{fmt(mc.equity)}</span></div>
        </div>
      </Card>

      <Card style={{flex:1,minWidth:240}}><SH title="Cash Flow Statement" subtitle={mc.month}/>
        <div style={{display:"flex",flexDirection:"column",gap:1}}>
          {[{l:"Operating Activities",v:mc.cfOps,c:SUCCESS},{l:"Investing Activities",v:mc.cfInv,c:INFO},{l:"Financing Activities",v:mc.cfFin,c:WARNING}].map((r,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${BORDER}`}}>
            <span style={{color:TEXT_SECONDARY,fontSize:12}}>{r.l}</span>
            <span style={{color:r.c,fontWeight:600,fontSize:12}}>{r.v>=0?"":""}{fmt(r.v)}</span>
          </div>))}
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:`2px solid ${GOLD}40`}}>
            <span style={{color:TEXT_PRIMARY,fontWeight:700,fontSize:13}}>Net Change in Cash</span>
            <span style={{color:mc.cfNet>=0?SUCCESS:DANGER,fontWeight:700,fontSize:15,fontFamily:"'Cormorant Garamond',serif"}}>{mc.cfNet>=0?"+":""}{fmt(mc.cfNet)}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:`1px solid ${BORDER}`}}>
            <span style={{color:TEXT_MUTED,fontSize:11}}>Ending Cash Balance</span>
            <span style={{color:INFO,fontWeight:700,fontSize:12}}>{fmt(mc.cashBal)}</span>
          </div>
        </div>
      </Card>
    </div>

    {/* OPERATING METRICS */}
    <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
      <Card style={{flex:1,minWidth:220}}><SH title="Working Capital"/>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[{l:"DSO",v:`${mc.dso} days`,t:"Target: <45",ok:mc.dso<=45},{l:"DPO",v:`${mc.dpo} days`,t:"Target: >30",ok:mc.dpo>=30},{l:"Cash Conversion",v:`${mc.dso-mc.dpo} days`,t:"Target: <20",ok:(mc.dso-mc.dpo)<=20}].map((r,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<2?`1px solid ${BORDER}`:"none"}}>
              <div><div style={{color:TEXT_SECONDARY,fontSize:12}}>{r.l}</div><div style={{color:TEXT_MUTED,fontSize:10}}>{r.t}</div></div>
              <span style={{color:r.ok?SUCCESS:WARNING,fontWeight:700,fontSize:16,fontFamily:"'Cormorant Garamond',serif"}}>{r.v}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{flex:1,minWidth:220}}><SH title="People & Utilization"/>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[{l:"Total Employees",v:mc.totalEmp,c:TEXT_PRIMARY},{l:"Billable Employees",v:mc.billableEmp,c:SUCCESS},{l:"Non-Billable",v:mc.totalEmp-mc.billableEmp,c:TEXT_MUTED},{l:"Billable Ratio",v:`${Math.round(mc.billableEmp/mc.totalEmp*100)}%`,c:GOLD}].map((r,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:i<3?`1px solid ${BORDER}`:"none"}}>
              <span style={{color:TEXT_SECONDARY,fontSize:12}}>{r.l}</span>
              <span style={{color:r.c,fontWeight:700,fontSize:14,fontFamily:"'Cormorant Garamond',serif"}}>{r.v}</span>
            </div>
          ))}
          <div style={{marginTop:4}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{color:TEXT_SECONDARY,fontSize:11}}>Utilization Rate</span><span style={{color:mc.util>=80?SUCCESS:mc.util>=70?WARNING:DANGER,fontWeight:700,fontSize:14}}>{mc.util}%</span></div>
          <div style={{width:"100%",height:8,background:BORDER,borderRadius:4,overflow:"hidden"}}><div style={{width:`${mc.util}%`,height:"100%",background:mc.util>=80?SUCCESS:mc.util>=70?WARNING:DANGER,borderRadius:4}}/></div></div>
        </div>
      </Card>

      <Card style={{flex:1,minWidth:220}}><SH title="Pipeline & Revenue Quality"/>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[{l:"Gross Pipeline",v:fmt(mc.grossPipe),c:TEXT_PRIMARY},{l:"Weighted Pipeline",v:fmt(mc.weightPipe),c:SUCCESS},{l:"Win Rate",v:`${mc.winRate}%`,c:mc.winRate>=50?SUCCESS:WARNING},{l:"Customer Retention",v:`${mc.custRetention}%`,c:mc.custRetention>=90?SUCCESS:WARNING,sub:"Logo retention"},{l:"Dollar Retention",v:`${mc.dollarRetention}%`,c:mc.dollarRetention>=100?SUCCESS:WARNING,sub:"Net Revenue Retention"}].map((r,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:i<4?`1px solid ${BORDER}`:"none"}}>
              <div><div style={{color:TEXT_SECONDARY,fontSize:12}}>{r.l}</div>{r.sub&&<div style={{color:TEXT_MUTED,fontSize:9}}>{r.sub}</div>}</div>
              <span style={{color:r.c,fontWeight:700,fontSize:14,fontFamily:"'Cormorant Garamond',serif"}}>{r.v}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>

    {/* ALERTS DETAIL */}
    <Card><SH title="Key Alerts & Action Items" subtitle={`${mc.month} close package`}/>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {mc.alerts.map((a,i)=>(
          <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 14px",background:`${alertColors[a.type]}08`,border:`1px solid ${alertColors[a.type]}20`,borderRadius:8}}>
            <AlertTriangle size={16} color={alertColors[a.type]} style={{marginTop:1,flexShrink:0}}/>
            <div><div style={{color:TEXT_PRIMARY,fontSize:12,fontWeight:500}}>{a.text}</div><div style={{color:TEXT_MUTED,fontSize:10,marginTop:2}}>Priority: <span style={{color:alertColors[a.type],fontWeight:600,textTransform:"capitalize"}}>{a.type==="danger"?"High":a.type==="warning"?"Medium":"Low"}</span></div></div>
          </div>
        ))}
      </div>
    </Card>
  </div>);
}

// ═══════ DATA ROOM VIEW ═══════
const DATA_ROOM_ITEMS=[
  {id:"incorp",title:"Incorporation Documents",owner:"Wayne DeCoste",role:"CEO",phone:"(510) 555-0101",email:"wayne@rescorgroup.com",updated:"May 15, 2026",pct:100,
    docs:[{name:"Articles of Incorporation — Rescor Security Group, Inc.",status:"complete",date:"Jan 2019"},{name:"Certificate of Good Standing — California",status:"complete",date:"Apr 2026"},{name:"Bylaws (Amended & Restated)",status:"complete",date:"Mar 2023"},{name:"SDVOSB Certification — VA CVE",status:"complete",date:"Nov 2025"},{name:"EIN Confirmation Letter (IRS)",status:"complete",date:"Jan 2019"},{name:"State Registrations — NY, TX, FL",status:"complete",date:"Feb 2026"},{name:"Board Resolutions — Current Fiscal Year",status:"complete",date:"May 2026"}]},
  {id:"fieldops",title:"Field Policy & Procedures",owner:"Nate Bennett",role:"VP Embedded Protective Ops",phone:"(510) 555-0102",email:"nate@rescorgroup.com",updated:"May 22, 2026",pct:82,
    docs:[{name:"Standard Operating Procedures — Executive Protection",status:"complete",date:"Apr 2026"},{name:"Use of Force Policy & Continuum",status:"complete",date:"Mar 2026"},{name:"Firearms Qualification Standards",status:"complete",date:"May 2026"},{name:"Client Onboarding & Threat Assessment Protocol",status:"complete",date:"Apr 2026"},{name:"Incident Reporting & After-Action Review",status:"complete",date:"Feb 2026"},{name:"International Deployment Procedures",status:"pending",date:"In Progress"},{name:"Vehicle Operations & Armored Transport SOP",status:"pending",date:"Draft"},{name:"Communications & OPSEC Protocols",status:"complete",date:"May 2026"}]},
  {id:"commission",title:"Commission Agreements",owner:"Michael Perez",role:"Dir. Business Strategy",phone:"(510) 555-0103",email:"michael@rescorgroup.com",updated:"Apr 30, 2026",pct:65,
    docs:[{name:"Sales Commission Plan — FY2026",status:"complete",date:"Jan 2026"},{name:"Business Development Referral Agreement Template",status:"complete",date:"Mar 2026"},{name:"Partner Revenue Share Agreement — Template",status:"pending",date:"Draft"},{name:"Government Contract Capture Bonus Structure",status:"pending",date:"In Review"},{name:"Commission Calculation Methodology & Examples",status:"complete",date:"Feb 2026"},{name:"Clawback & Chargeback Policy",status:"pending",date:"Not Started"}]},
  {id:"accounting",title:"Accounting Policy & Procedures",owner:"[Head of Finance]",role:"Head of Finance",phone:"—",email:"—",updated:"Mar 10, 2026",pct:45,
    docs:[{name:"Revenue Recognition Policy (ASC 606)",status:"pending",date:"Draft"},{name:"Chart of Accounts — Standardized",status:"complete",date:"Mar 2026"},{name:"Month-End Close Checklist & Timeline",status:"complete",date:"Mar 2026"},{name:"Expense Reimbursement Policy",status:"pending",date:"Draft"},{name:"Fixed Asset Capitalization Policy",status:"pending",date:"Not Started"},{name:"Intercompany & Related Party Transaction Policy",status:"pending",date:"Not Started"},{name:"Internal Controls Documentation (SOX-lite)",status:"pending",date:"Not Started"},{name:"Travel & Entertainment Policy",status:"pending",date:"Draft"},{name:"Procurement & Purchase Order Policy",status:"pending",date:"Not Started"}]},
  {id:"clients",title:"Client Register",owner:"Michael Perez",role:"Dir. Business Strategy",phone:"(510) 555-0103",email:"michael@rescorgroup.com",updated:"May 28, 2026",pct:100,
    docs:CLIENTS.map(c=>({name:`${c.name} — ${c.service} | ${c.segment}`,status:"complete",date:"Active",extra:`${fmt(c.annualRev)}/yr | ${c.margin}% margin | ${c.operators} operators | ${c.geo}`}))},
  {id:"vendors",title:"Vendor Register",owner:"Brenda Roh",role:"Chief of Staff",phone:"(510) 555-0104",email:"brenda@rescorgroup.com",updated:"May 20, 2026",pct:90,
    docs:VENDOR_CONTRACTS.map(v=>({name:`${v.vendor} — ${v.category}`,status:v.status==="Renewal Due"?"pending":"complete",date:v.status==="Renewal Due"?"Renewal Due":"Active",extra:`$${v.monthlyValue}K/mo | ${v.terms} | ${v.startDate} to ${v.endDate}`}))},
  {id:"financial",title:"Financial Statements",owner:"[Head of Finance]",role:"Head of Finance",phone:"—",email:"—",updated:"May 28, 2026",pct:92,
    docs:MONTHS.map((m,i)=>({name:`${m} — Monthly Financial Package`,status:"complete",date:MONTHLY_CLOSE[i].closeDate,extra:`Rev: ${fmt(PNL_DATA[i].revenue)} | GM: ${PNL_DATA[i].grossMarginPct}% | Op Profit: ${fmt(PNL_DATA[i].operatingProfit)} (${PNL_DATA[i].opMarginPct}%)`})).concat([{name:"FY2026 YTD Consolidated Financials",status:"complete",date:"May 2026"},{name:"FY2025 Annual Financial Statements",status:"complete",date:"Feb 2026"}])},
  {id:"insurance",title:"Insurance Documentation",owner:"Brenda Roh",role:"Chief of Staff",phone:"(510) 555-0104",email:"brenda@rescorgroup.com",updated:"May 5, 2026",pct:78,
    docs:[{name:"General Liability — HUB International",status:VENDOR_CONTRACTS.find(v=>v.vendor==="HUB International")?.status==="Renewal Due"?"pending":"complete",date:"Renewal Due Dec 2025",extra:"$42K/mo annual premium"},{name:"Professional Indemnity — Lloyd's of London",status:"complete",date:"Active through Feb 2026",extra:"$28K/mo annual premium"},{name:"Workers Compensation — AmTrust North",status:"complete",date:"Active through May 2026",extra:"$35K/mo annual premium"},{name:"Errors & Omissions Policy",status:"complete",date:"Active"},{name:"Cyber Liability Insurance",status:"pending",date:"Not Obtained"},{name:"Umbrella / Excess Liability",status:"complete",date:"Active"},{name:"Certificates of Insurance — Client File",status:"pending",date:"3 of 16 expired"}]},
  {id:"employee",title:"Employee Information",owner:"Brenda Roh",role:"Chief of Staff",phone:"(510) 555-0104",email:"brenda@rescorgroup.com",updated:"May 25, 2026",pct:72,
    docs:[{name:"Employee Roster — Active (Current Month)",status:"complete",date:"May 2026",extra:`${MONTHLY_CLOSE[11].totalEmp} total | ${MONTHLY_CLOSE[11].billableEmp} billable | ${MONTHLY_CLOSE[11].util}% utilization`},{name:"Guard Card & Licensing Register — CA, NY, TX, FL",status:"pending",date:"4 renewals pending"},{name:"Firearms Qualification Records",status:"complete",date:"May 2026"},{name:"Background Check & Clearance Log",status:"complete",date:"May 2026"},{name:"Employment Agreements — Template & Executed",status:"pending",date:"8 of 94 missing"},{name:"Independent Contractor Classification Review",status:"pending",date:"Not Started"},{name:"Org Chart — Current",status:"complete",date:"Apr 2026"},{name:"Benefits Summary & Enrollment Records",status:"complete",date:"Jan 2026"}]},
  {id:"tax",title:"Tax Documents",owner:"[Head of Finance]",role:"Head of Finance",phone:"—",email:"—",updated:"Apr 15, 2026",pct:85,
    docs:[{name:"Federal Tax Return — FY2025 (Form 1120S)",status:"complete",date:"Apr 2026"},{name:"State Tax Returns — CA, NY, TX, FL",status:"complete",date:"Apr 2026"},{name:"Quarterly Payroll Tax Filings (941)",status:"complete",date:"Q1 2026"},{name:"State Unemployment (SUTA) Filings",status:"complete",date:"Q1 2026"},{name:"Sales & Use Tax — Multi-State Nexus Analysis",status:"pending",date:"In Progress"},{name:"1099 Filings — FY2025 Contractors",status:"complete",date:"Jan 2026"},{name:"Property Tax Assessments",status:"pending",date:"Not Applicable"}]},
  {id:"audits",title:"Audits & Compliance",owner:"[Head of Finance]",role:"Head of Finance",phone:"—",email:"—",updated:"Feb 28, 2026",pct:55,
    docs:[{name:"FY2025 External Audit — Engagement Letter",status:"pending",date:"Not Engaged"},{name:"FY2024 Financial Review (CPA Firm)",status:"complete",date:"Sep 2025"},{name:"SDVOSB Compliance Documentation",status:"complete",date:"Nov 2025"},{name:"SOC 2 Readiness Assessment",status:"pending",date:"Not Started"},{name:"Internal Controls Assessment",status:"pending",date:"Not Started"},{name:"Government Contract Compliance (DCAA)",status:"pending",date:"In Progress"},{name:"California BSIS Licensing Audit Trail",status:"complete",date:"Mar 2026"}]},
  {id:"budget",title:"Budget & Forecasts",owner:"[Head of Finance]",role:"Head of Finance",phone:"—",email:"—",updated:"May 28, 2026",pct:88,
    docs:MONTHS.map((m,i)=>({name:`${m} — Budget vs. Actual Variance Report`,status:"complete",date:MONTHLY_CLOSE[i].closeDate,extra:`Budget Rev: ${fmt(PNL_DATA[i].budgetRev)} | Actual: ${fmt(PNL_DATA[i].revenue)} | Var: ${PNL_DATA[i].revenue>=PNL_DATA[i].budgetRev?"+":""}${fmt(PNL_DATA[i].revenue-PNL_DATA[i].budgetRev)}`})).concat([{name:"FY2026 Annual Operating Budget",status:"complete",date:"Dec 2025"},{name:"FY2027 Preliminary Budget Framework",status:"pending",date:"Not Started"},{name:"Rolling 13-Week Cash Forecast",status:"complete",date:"May 2026"},{name:"3-Year Strategic Financial Plan",status:"pending",date:"Draft"}])},
];

function DataRoomView(){
  const[selected,setSelected]=useState(null);
  const item=selected!==null?DATA_ROOM_ITEMS.find(d=>d.id===selected):null;
  const totalItems=DATA_ROOM_ITEMS.length;
  const greenItems=DATA_ROOM_ITEMS.filter(d=>d.pct>=75).length;
  const yellowItems=DATA_ROOM_ITEMS.filter(d=>d.pct>=50&&d.pct<75).length;
  const redItems=DATA_ROOM_ITEMS.filter(d=>d.pct<50).length;
  const avgPct=Math.round(DATA_ROOM_ITEMS.reduce((s,d)=>s+d.pct,0)/totalItems);
  const pctColor=(p)=>p>=75?SUCCESS:p>=50?WARNING:DANGER;
  const statusIcon=(s)=>s==="complete"?<CheckCircle size={14} color={SUCCESS}/>:<Clock size={14} color={WARNING}/>;

  if(item) return(<div style={{display:"flex",flexDirection:"column",gap:18}}>
    <button onClick={()=>setSelected(null)} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",color:GOLD,cursor:"pointer",fontSize:12,fontWeight:600,padding:0}}><ArrowLeft size={16}/>Back to Data Room</button>

    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
      <div>
        <div style={{fontSize:20,fontWeight:700,color:GOLD,fontFamily:"'Cormorant Garamond',serif"}}>{item.title}</div>
        <div style={{fontSize:11,color:TEXT_MUTED,marginTop:2}}>Last updated: <span style={{color:TEXT_SECONDARY}}>{item.updated}</span></div>
      </div>
      <div style={{display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:28,fontWeight:700,color:pctColor(item.pct),fontFamily:"'Cormorant Garamond',serif"}}>{item.pct}%</div><div style={{fontSize:9,color:TEXT_MUTED}}>Complete</div></div>
        <div style={{width:1,height:40,background:BORDER}}/>
        <div>
          <div style={{fontSize:12,color:TEXT_PRIMARY,fontWeight:600}}>{item.owner}</div>
          <div style={{fontSize:10,color:TEXT_MUTED}}>{item.role}</div>
          {item.phone!=="—"&&<div style={{display:"flex",alignItems:"center",gap:4,marginTop:3}}><Phone size={10} color={TEXT_MUTED}/><span style={{fontSize:10,color:TEXT_SECONDARY}}>{item.phone}</span></div>}
          {item.email!=="—"&&<div style={{display:"flex",alignItems:"center",gap:4,marginTop:1}}><Mail size={10} color={TEXT_MUTED}/><span style={{fontSize:10,color:TEXT_SECONDARY}}>{item.email}</span></div>}
        </div>
      </div>
    </div>

    <div style={{width:"100%",height:6,background:BORDER,borderRadius:3,overflow:"hidden"}}><div style={{width:`${item.pct}%`,height:"100%",background:pctColor(item.pct),borderRadius:3,transition:"width 0.5s"}}/></div>

    <Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <SH title="Documents" subtitle={`${item.docs.filter(d=>d.status==="complete").length} of ${item.docs.length} complete`}/>
        <div style={{display:"flex",gap:8}}>
          <span style={{fontSize:10,color:SUCCESS,fontWeight:600}}>{item.docs.filter(d=>d.status==="complete").length} Complete</span>
          <span style={{fontSize:10,color:WARNING,fontWeight:600}}>{item.docs.filter(d=>d.status==="pending").length} Pending</span>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        {item.docs.map((d,i)=>(
          <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",background:d.status==="pending"?`${WARNING}06`:BG_CARD_HOVER,borderRadius:8,border:`1px solid ${d.status==="pending"?`${WARNING}20`:BORDER}`,cursor:"pointer",transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=GOLD;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=d.status==="pending"?`${WARNING}20`:BORDER;}}>
            {statusIcon(d.status)}
            <div style={{flex:1,minWidth:0}}>
              <div style={{color:TEXT_PRIMARY,fontSize:12,fontWeight:500}}>{d.name}</div>
              {d.extra&&<div style={{color:TEXT_MUTED,fontSize:10,marginTop:2}}>{d.extra}</div>}
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <span style={{fontSize:10,color:d.status==="complete"?SUCCESS:WARNING,fontWeight:600,background:d.status==="complete"?`${SUCCESS}15`:`${WARNING}15`,padding:"2px 8px",borderRadius:10}}>{d.status==="complete"?"Complete":"Pending"}</span>
              <div style={{fontSize:9,color:TEXT_MUTED,marginTop:3}}>{d.date}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>);

  // GRID VIEW
  return(<div style={{display:"flex",flexDirection:"column",gap:18}}>
    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
      <KPICard icon={FolderOpen} label="Total Categories" value={totalItems} sub={`${DATA_ROOM_ITEMS.reduce((s,d)=>s+d.docs.length,0)} total documents`} small/>
      <KPICard icon={CheckCircle} label="Complete (≥75%)" value={greenItems} accent={SUCCESS} sub={`${Math.round(greenItems/totalItems*100)}% of categories`} small/>
      <KPICard icon={Clock} label="In Progress (50-74%)" value={yellowItems} accent={WARNING} small/>
      <KPICard icon={AlertTriangle} label="Needs Attention (<50%)" value={redItems} accent={DANGER} sub={redItems>0?"Action required":"All on track"} small/>
      <KPICard icon={TrendingUp} label="Overall Readiness" value={`${avgPct}%`} accent={pctColor(avgPct)} small/>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
      {DATA_ROOM_ITEMS.map((d,i)=>{const pc=pctColor(d.pct);const complete=d.docs.filter(doc=>doc.status==="complete").length;const total=d.docs.length;return(
        <div key={i} onClick={()=>setSelected(d.id)} style={{background:BG_CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:"18px 16px",cursor:"pointer",transition:"all 0.2s",position:"relative",overflow:"hidden"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=GOLD;e.currentTarget.style.background=BG_CARD_HOVER;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.background=BG_CARD;}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:BORDER}}><div style={{width:`${d.pct}%`,height:"100%",background:pc,transition:"width 0.5s"}}/></div>

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div style={{background:`${pc}15`,borderRadius:8,padding:8}}><FileText size={18} color={pc}/></div>
            <div style={{fontSize:22,fontWeight:700,color:pc,fontFamily:"'Cormorant Garamond',serif",lineHeight:1}}>{d.pct}%</div>
          </div>

          <div style={{color:TEXT_PRIMARY,fontSize:13,fontWeight:600,marginBottom:4,lineHeight:1.3}}>{d.title}</div>
          <div style={{fontSize:10,color:TEXT_MUTED,marginBottom:10}}>{complete}/{total} documents</div>

          <div style={{borderTop:`1px solid ${BORDER}`,paddingTop:10,display:"flex",flexDirection:"column",gap:3}}>
            <div style={{fontSize:11,color:TEXT_SECONDARY,fontWeight:500}}>{d.owner}</div>
            <div style={{fontSize:9,color:TEXT_MUTED}}>{d.role}</div>
            {d.phone!=="—"&&<div style={{display:"flex",alignItems:"center",gap:3,marginTop:2}}><Phone size={9} color={TEXT_MUTED}/><span style={{fontSize:9,color:TEXT_MUTED}}>{d.phone}</span></div>}
            {d.email!=="—"&&<div style={{display:"flex",alignItems:"center",gap:3}}><Mail size={9} color={TEXT_MUTED}/><span style={{fontSize:9,color:TEXT_MUTED}}>{d.email}</span></div>}
          </div>

          <div style={{marginTop:10,fontSize:9,color:TEXT_MUTED}}>Updated: {d.updated}</div>
        </div>
      );})}
    </div>
  </div>);
}

// ═══════ OPERATIONS THEATER VIEW ═══════
const STATE_OPS=[
  {state:"California",abbr:"CA",x:88,y:230,revenue:3200,operators:16,hq:true,clients:["Meridian Holdings","Apex Ventures","Sterling & Associates","Whitfield Media Group"],region:"West Coast"},
  {state:"New York",abbr:"NY",x:755,y:155,revenue:3140,operators:13,hq:false,clients:["Vanguard Capital Group","Harmon Estate","Kensington Partners"],region:"Northeast"},
  {state:"Florida",abbr:"FL",x:700,y:400,revenue:4220,operators:19,hq:false,clients:["Atlas Family Trust","Federal Bureau of Prisons","Northstar Foundation","DHS Region IV"],region:"Southeast"},
  {state:"Texas",abbr:"TX",x:410,y:380,revenue:2570,operators:12,hq:false,clients:["Centurion Defense Systems","Omni Infrastructure"],region:"Texas / Central"},
  {state:"Virginia",abbr:"VA",x:710,y:230,revenue:890,operators:4,hq:false,clients:["Government subcontracts"],region:"Southeast"},
  {state:"Washington DC",abbr:"DC",x:730,y:215,revenue:1450,operators:6,hq:false,clients:["Federal agency work"],region:"Northeast"},
  {state:"Georgia",abbr:"GA",x:660,y:340,revenue:620,operators:3,hq:false,clients:["Regional executive protection"],region:"Southeast"},
  {state:"Illinois",abbr:"IL",x:530,y:195,revenue:480,operators:2,hq:false,clients:["Corporate protection detail"],region:"Texas / Central"},
  {state:"Nevada",abbr:"NV",x:130,y:215,revenue:340,operators:2,hq:false,clients:["Private client events"],region:"West Coast"},
  {state:"Colorado",abbr:"CO",x:265,y:235,revenue:290,operators:1,hq:false,clients:["Executive retreat security"],region:"West Coast"},
  {state:"Washington",abbr:"WA",x:105,y:65,revenue:410,operators:2,hq:false,clients:["Tech executive protection"],region:"West Coast"},
  {state:"Massachusetts",abbr:"MA",x:790,y:130,revenue:520,operators:3,hq:false,clients:["Financial services EP"],region:"Northeast"},
  {state:"Arizona",abbr:"AZ",x:175,y:310,revenue:180,operators:1,hq:false,clients:["Residential security"],region:"West Coast"},
  {state:"North Carolina",abbr:"NC",x:695,y:280,revenue:350,operators:2,hq:false,clients:["Corporate protection"],region:"Southeast"},
  {state:"Pennsylvania",abbr:"PA",x:720,y:175,revenue:280,operators:1,hq:false,clients:["Executive protection"],region:"Northeast"},
  {state:"Hawaii",abbr:"HI",x:230,y:430,revenue:150,operators:1,hq:false,clients:["Private estate security"],region:"West Coast"},
];
const TOTAL_DOMESTIC_REV=STATE_OPS.reduce((s,st)=>s+st.revenue,0);
const TOTAL_DOMESTIC_OPS=STATE_OPS.reduce((s,st)=>s+st.operators,0);
const INTL_REV=CLIENTS.filter(c=>c.geo==="International").reduce((s,c)=>s+c.annualRev,0);
const INTL_OPS=CLIENTS.filter(c=>c.geo==="International").reduce((s,c)=>s+c.operators,0);

function OpsTheaterView(){
  const[hover,setHover]=useState(null);
  const[tooltipPos,setTooltipPos]=useState({x:0,y:0});
  const maxRev=Math.max(...STATE_OPS.map(s=>s.revenue));
  const minR=6,maxR=32;

  const regionTotals={};STATE_OPS.forEach(s=>{if(!regionTotals[s.region])regionTotals[s.region]={revenue:0,operators:0,states:0};regionTotals[s.region].revenue+=s.revenue;regionTotals[s.region].operators+=s.operators;regionTotals[s.region].states+=1;});
  const regionData=Object.entries(regionTotals).map(([name,d])=>({name,...d})).sort((a,b)=>b.revenue-a.revenue);

  return(<div style={{display:"flex",flexDirection:"column",gap:18}}>
    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
      <KPICard icon={MapPin} label="Domestic Revenue" value={fmt(TOTAL_DOMESTIC_REV)} sub={`${STATE_OPS.length} states`} small/>
      <KPICard icon={Users} label="Domestic Operators" value={TOTAL_DOMESTIC_OPS} sub="Field deployed" accent={SUCCESS} small/>
      <KPICard icon={Crosshair} label="International" value={fmt(INTL_REV)} sub={`${INTL_OPS} operators deployed`} accent={INFO} small/>
      <KPICard icon={Building2} label="HQ" value="Oakland, CA" sub="Licensed: CA, NY, TX, FL" accent={GOLD} small/>
      <KPICard icon={TrendingUp} label="Revenue / State" value={fmt(Math.round(TOTAL_DOMESTIC_REV/STATE_OPS.length))} sub="Average across active states" accent={WARNING} small/>
    </div>

    {/* MAP */}
    <Card style={{padding:0,overflow:"hidden",position:"relative"}}>
      <div style={{padding:"16px 20px 0"}}><SH title="Domestic Operations Map" subtitle="Circle size indicates revenue magnitude. Hover for detail."/></div>
      <div style={{position:"relative",width:"100%",paddingBottom:"52%",background:`linear-gradient(180deg,${BG_CARD} 0%,#0D0D12 100%)`}}>
        <svg viewBox="0 0 880 460" style={{position:"absolute",top:0,left:0,width:"100%",height:"100%"}}>
          {/* Simplified US outline */}
          <path d="M60,50 L60,30 L110,25 L115,55 L105,80 L92,130 L70,170 L62,200 L65,240 L70,280 L75,320 L80,360 L95,400 L110,410 L140,395 L160,370 L180,340 L200,330 L220,340 L250,325 L280,310 L310,300 L340,310 L370,340 L400,360 L430,390 L460,400 L490,410 L520,405 L550,400 L580,395 L610,400 L640,410 L670,415 L700,420 L730,400 L745,370 L755,340 L770,310 L780,285 L775,260 L760,240 L740,225 L730,200 L740,175 L755,155 L770,135 L790,120 L810,110 L790,95 L770,90 L750,100 L730,115 L710,130 L690,140 L670,145 L650,140 L630,130 L610,120 L590,115 L570,120 L550,130 L530,135 L510,130 L490,120 L470,110 L450,105 L430,100 L410,95 L390,90 L370,85 L350,80 L330,78 L310,80 L290,85 L270,90 L250,95 L230,95 L210,90 L190,80 L170,70 L150,60 L130,50 L110,45 L90,45 L60,50 Z" fill="none" stroke={BORDER_LIGHT} strokeWidth="1.5" opacity="0.4"/>
          {/* State boundaries hint lines */}
          <line x1="200" y1="30" x2="200" y2="420" stroke={BORDER} strokeWidth="0.3" opacity="0.3"/>
          <line x1="400" y1="30" x2="400" y2="420" stroke={BORDER} strokeWidth="0.3" opacity="0.3"/>
          <line x1="600" y1="30" x2="600" y2="420" stroke={BORDER} strokeWidth="0.3" opacity="0.3"/>
          <line x1="50" y1="200" x2="830" y2="200" stroke={BORDER} strokeWidth="0.3" opacity="0.3"/>
          <line x1="50" y1="320" x2="830" y2="320" stroke={BORDER} strokeWidth="0.3" opacity="0.3"/>
          {/* Grid labels */}
          <text x="60" y="18" fill={TEXT_MUTED} fontSize="8" opacity="0.5">PACIFIC</text>
          <text x="400" y="18" fill={TEXT_MUTED} fontSize="8" opacity="0.5">CENTRAL</text>
          <text x="700" y="18" fill={TEXT_MUTED} fontSize="8" opacity="0.5">ATLANTIC</text>

          {/* Pulse rings for HQ */}
          {STATE_OPS.filter(s=>s.hq).map(s=>(<>
            <circle key={s.abbr+"p1"} cx={s.x} cy={s.y} r={maxR+8} fill="none" stroke={GOLD} strokeWidth="1" opacity="0.3"><animate attributeName="r" from={maxR+4} to={maxR+20} dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite"/></circle>
            <circle key={s.abbr+"p2"} cx={s.x} cy={s.y} r={maxR+4} fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.2"><animate attributeName="r" from={maxR+2} to={maxR+16} dur="2s" begin="1s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.3" to="0" dur="2s" begin="1s" repeatCount="indefinite"/></circle>
          </>))}

          {/* State dots */}
          {STATE_OPS.map(s=>{const r=minR+((s.revenue/maxRev)*(maxR-minR));const isHov=hover===s.abbr;return(
            <g key={s.abbr} onMouseEnter={(e)=>{setHover(s.abbr);const rect=e.currentTarget.closest('svg').getBoundingClientRect();setTooltipPos({x:s.x,y:s.y});}} onMouseLeave={()=>setHover(null)} style={{cursor:"pointer"}}>
              <circle cx={s.x} cy={s.y} r={r+2} fill={s.hq?`${GOLD}15`:`${SUCCESS}10`} stroke="none"/>
              <circle cx={s.x} cy={s.y} r={r} fill={s.hq?GOLD:SUCCESS} opacity={isHov?0.95:0.6} stroke={isHov?"#fff":s.hq?GOLD:SUCCESS} strokeWidth={isHov?2:1} style={{transition:"all 0.2s"}}/>
              <text x={s.x} y={s.y+3} textAnchor="middle" fill={r>14?"#000":"none"} fontSize="9" fontWeight="700" fontFamily="DM Sans">{r>14?s.abbr:""}</text>
              {r<=14&&<text x={s.x} y={s.y-r-5} textAnchor="middle" fill={TEXT_MUTED} fontSize="8" fontWeight="600">{s.abbr}</text>}
            </g>
          );})}

          {/* HQ label */}
          {STATE_OPS.filter(s=>s.hq).map(s=>{const r=minR+((s.revenue/maxRev)*(maxR-minR));return(
            <text key={s.abbr+"lbl"} x={s.x} y={s.y+r+14} textAnchor="middle" fill={GOLD} fontSize="8" fontWeight="700" letterSpacing="1">HQ</text>
          );})}
        </svg>

        {/* Tooltip */}
        {hover&&(()=>{const s=STATE_OPS.find(st=>st.abbr===hover);if(!s)return null;const left=Math.min(Math.max(s.x/880*100,15),75);const top=Math.min(Math.max(s.y/460*100,10),80);return(
          <div style={{position:"absolute",left:`${left}%`,top:`${top}%`,transform:"translate(-50%,-120%)",background:BG_CARD,border:`1px solid ${s.hq?GOLD:BORDER_LIGHT}`,borderRadius:10,padding:"12px 16px",minWidth:200,zIndex:10,boxShadow:"0 8px 32px rgba(0,0,0,0.5)",pointerEvents:"none"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{fontSize:14,fontWeight:700,color:s.hq?GOLD:TEXT_PRIMARY,fontFamily:"'Cormorant Garamond',serif"}}>{s.state}</div>
              {s.hq&&<span style={{fontSize:8,color:GOLD,fontWeight:700,background:`${GOLD}20`,padding:"2px 6px",borderRadius:4,letterSpacing:1}}>HQ</span>}
            </div>
            <div style={{display:"flex",gap:16,marginBottom:8}}>
              <div><div style={{fontSize:9,color:TEXT_MUTED,fontWeight:600,letterSpacing:1,textTransform:"uppercase"}}>Revenue</div><div style={{fontSize:18,fontWeight:700,color:SUCCESS,fontFamily:"'Cormorant Garamond',serif"}}>{fmt(s.revenue)}</div></div>
              <div><div style={{fontSize:9,color:TEXT_MUTED,fontWeight:600,letterSpacing:1,textTransform:"uppercase"}}>Operators</div><div style={{fontSize:18,fontWeight:700,color:INFO,fontFamily:"'Cormorant Garamond',serif"}}>{s.operators}</div></div>
            </div>
            <div style={{borderTop:`1px solid ${BORDER}`,paddingTop:6}}>
              {s.clients.map((c,i)=>(<div key={i} style={{fontSize:10,color:TEXT_SECONDARY,padding:"1px 0"}}>{c}</div>))}
            </div>
            <div style={{position:"absolute",bottom:-6,left:"50%",transform:"translateX(-50%)",width:12,height:12,background:BG_CARD,border:`1px solid ${s.hq?GOLD:BORDER_LIGHT}`,borderTop:"none",borderLeft:"none",transform:"translateX(-50%) rotate(45deg)"}}/>
          </div>
        );})()}
      </div>

      {/* Legend */}
      <div style={{padding:"12px 20px",borderTop:`1px solid ${BORDER}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,borderRadius:5,background:GOLD}}/><span style={{fontSize:10,color:TEXT_MUTED}}>HQ (Oakland)</span></div>
          <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,borderRadius:5,background:SUCCESS,opacity:0.6}}/><span style={{fontSize:10,color:TEXT_MUTED}}>Field Operations</span></div>
          <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:6,height:6,borderRadius:3,background:SUCCESS,opacity:0.6}}/><span style={{fontSize:10,color:TEXT_MUTED}}>Smaller = Less Revenue</span></div>
          <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:14,height:14,borderRadius:7,background:SUCCESS,opacity:0.6}}/><span style={{fontSize:10,color:TEXT_MUTED}}>Larger = More Revenue</span></div>
        </div>
        <div style={{fontSize:10,color:TEXT_MUTED}}>Hover over any location for detail</div>
      </div>
    </Card>

    {/* REGION BREAKDOWN */}
    <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
      <Card style={{flex:1.5,minWidth:340}}><SH title="Revenue by Region" subtitle="Domestic operations breakdown"/>
        <ResponsiveContainer width="100%" height={220}><BarChart data={regionData} barSize={24}><CartesianGrid stroke={BORDER} strokeDasharray="3 3"/><XAxis dataKey="name" tick={{fill:TEXT_MUTED,fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:TEXT_MUTED,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}K`}/><Tooltip content={<CustomTooltip formatter={v=>`$${v}K`}/>}/><Bar dataKey="revenue" name="Revenue" fill={SUCCESS} radius={[5,5,0,0]} opacity={0.7}>{regionData.map((d,i)=><Cell key={i} fill={GEO_COLORS[d.name]||SUCCESS}/>)}</Bar></BarChart></ResponsiveContainer>
      </Card>

      <Card style={{flex:1,minWidth:280}}><SH title="Operators by Region"/>
        <ResponsiveContainer width="100%" height={160}><PieChart><Pie data={regionData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="operators" stroke="none">{regionData.map((d,i)=><Cell key={i} fill={GEO_COLORS[d.name]||SUCCESS}/>)}</Pie><Tooltip content={<CustomTooltip/>}/></PieChart></ResponsiveContainer>
        <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:4}}>{regionData.map(d=>(<div key={d.name} style={{display:"flex",justifyContent:"space-between",fontSize:11}}><div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:7,height:7,borderRadius:2,background:GEO_COLORS[d.name]||SUCCESS}}/><span style={{color:TEXT_SECONDARY}}>{d.name}</span></div><div style={{display:"flex",gap:10}}><span style={{color:TEXT_PRIMARY,fontWeight:600}}>{d.operators} ops</span><span style={{color:TEXT_MUTED}}>{d.states} states</span></div></div>))}</div>
      </Card>
    </div>

    {/* STATE TABLE */}
    <Card><SH title="Operations by State" subtitle="All active domestic locations ranked by revenue"/>
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"separate",borderSpacing:0,fontSize:12}}>
        <thead><tr>{["State","Region","Revenue","Operators","Rev/Op","Clients"].map(h=>(<th key={h} style={{padding:"8px 12px",textAlign:["Revenue","Operators","Rev/Op"].includes(h)?"center":"left",color:TEXT_MUTED,fontWeight:600,fontSize:10,letterSpacing:1,textTransform:"uppercase",borderBottom:`1px solid ${BORDER}`,whiteSpace:"nowrap"}}>{h}</th>))}</tr></thead>
        <tbody>{[...STATE_OPS].sort((a,b)=>b.revenue-a.revenue).map((s,i)=>(
          <tr key={i} onMouseEnter={e=>e.currentTarget.style.background=BG_CARD_HOVER} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <td style={{padding:"9px 12px",whiteSpace:"nowrap"}}><div style={{display:"flex",alignItems:"center",gap:6}}>{s.hq&&<div style={{width:6,height:6,borderRadius:3,background:GOLD}}/>}<span style={{color:TEXT_PRIMARY,fontWeight:600}}>{s.state}</span><span style={{color:TEXT_MUTED,fontSize:10}}>({s.abbr})</span>{s.hq&&<span style={{fontSize:8,color:GOLD,fontWeight:700,background:`${GOLD}20`,padding:"1px 4px",borderRadius:3}}>HQ</span>}</div></td>
            <td style={{padding:"9px 12px"}}><div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:6,height:6,borderRadius:2,background:GEO_COLORS[s.region]||SUCCESS}}/><span style={{color:TEXT_SECONDARY,fontSize:11}}>{s.region}</span></div></td>
            <td style={{padding:"9px 12px",textAlign:"center",color:SUCCESS,fontWeight:700}}>{fmt(s.revenue)}</td>
            <td style={{padding:"9px 12px",textAlign:"center",color:INFO,fontWeight:600}}>{s.operators}</td>
            <td style={{padding:"9px 12px",textAlign:"center",color:GOLD,fontWeight:600}}>{fmt(Math.round(s.revenue/s.operators))}</td>
            <td style={{padding:"9px 12px",color:TEXT_SECONDARY,fontSize:11}}>{s.clients.join(", ")}</td>
          </tr>
        ))}</tbody>
        <tfoot><tr style={{borderTop:`2px solid ${GOLD}40`}}><td style={{padding:"9px 12px",color:GOLD,fontWeight:700}} colSpan={2}>DOMESTIC TOTAL ({STATE_OPS.length} states)</td><td style={{padding:"9px 12px",textAlign:"center",color:GOLD,fontWeight:700}}>{fmt(TOTAL_DOMESTIC_REV)}</td><td style={{padding:"9px 12px",textAlign:"center",color:GOLD,fontWeight:700}}>{TOTAL_DOMESTIC_OPS}</td><td style={{padding:"9px 12px",textAlign:"center",color:GOLD,fontWeight:700}}>{fmt(Math.round(TOTAL_DOMESTIC_REV/TOTAL_DOMESTIC_OPS))}</td><td/></tr>
        <tr><td style={{padding:"9px 12px",color:INFO,fontWeight:700}} colSpan={2}>INTERNATIONAL</td><td style={{padding:"9px 12px",textAlign:"center",color:INFO,fontWeight:700}}>{fmt(INTL_REV)}</td><td style={{padding:"9px 12px",textAlign:"center",color:INFO,fontWeight:700}}>{INTL_OPS}</td><td style={{padding:"9px 12px",textAlign:"center",color:INFO,fontWeight:700}}>{fmt(Math.round(INTL_REV/INTL_OPS))}</td><td style={{padding:"9px 12px",color:TEXT_SECONDARY,fontSize:11}}>Pacific Rim Logistics, Blackridge Minerals, Caldwell Private Office</td></tr>
        </tfoot>
      </table></div>
    </Card>
  </div>);
}
