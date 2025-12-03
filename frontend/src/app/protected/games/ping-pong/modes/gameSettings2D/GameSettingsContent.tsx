"use client";

import NextImage from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { useSettings } from "../../context/settings/SettingsContext";

// Types
interface PadColor {
  id: number;
  color: string;
  imgSrc: string;
}

interface TableBg {
  id: number;
  imgSrc: string;
  name?: string;
}

interface BallOption {
  id: number;
  ballImg: string;
  name?: string;
}

// Improved rounded rectangle function with better performance
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

// Enhanced clipped circle image function
function drawClippedCircleImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  r: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
}

// Helper function for color hue rotation
function getHueRotation(color: string): number {
  const colorMap: { [key: string]: number } = {
    red: 0,
    green: 120,
    blue: 240,
    pink: 320,
    purple: 280,
    teal: 180,
    fuchsia: 300,
    white: 0,
  };
  return colorMap[color] || 0;
}

// Enhanced Background Table Selector
function BgTable({
  table,
  onSelect,
  selectedTable,
}: {
  table: TableBg[];
  onSelect: (imgSrc: string) => void;
  selectedTable: string;
}) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="w-full p-6 bg-black/60 backdrop-blur-sm rounded-2xl shadow-lg">
        <div className="grid grid-cols-4 gap-4">
          {table.map(({ id, imgSrc, name }) => (
            <button
              key={id}
              onClick={() => onSelect(imgSrc)}
              className={`
                relative p-2 rounded-xl transition-all duration-300 transform hover:scale-105
                ${
                  selectedTable === imgSrc
                    ? "ring-4 ring-[#FFB700] shadow-lg shadow-[#FFB700]"
                    : "hover:ring-2 hover:ring-white/60 hover:shadow-md"
                }
              `}
              title={name || `Table ${id + 1}`}
            >
              <div className="relative overflow-hidden rounded-lg aspect-square">
                <NextImage
                  src={imgSrc}
                  alt={`Table ${id + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 200px"
                />
              </div>
              {selectedTable === imgSrc && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#FFB700] rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-black"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Enhanced Paddle Selector
function PadList({
  pads,
  onSelect,
  selectedColor,
}: {
  pads: PadColor[];
  onSelect: (color: string) => void;
  selectedColor: string;
}) {
  return (
    <div className="w-full p-6 bg-black/60 backdrop-blur-sm rounded-2xl shadow-lg">
      <div className="grid grid-cols-4 gap-4">
        {pads.map(({ id, color, imgSrc }) => (
          <button
            key={id}
            onClick={() => onSelect(color)}
            className={`
              relative p-3 rounded-xl transition-all duration-300 transform hover:scale-105
              ${
                selectedColor === color
                  ? "ring-4 ring-[#FFB700] shadow-lg shadow-[#FFB700]"
                  : "hover:ring-2 hover:ring-white/60 hover:shadow-md"
              }
            `}
            title={`${color.charAt(0).toUpperCase() + color.slice(1)} Paddle`}
          >
            <div className="relative overflow-hidden rounded-lg aspect-square">
                <svg  fill={color} viewBox="0 0 100 100">
                    <path 
                        fillRule="evenodd"
                        d="M79.2572021,62.3760986c0.1948853-0.2108154,0.3927612-0.421814,0.5831909-0.6323853  c0.2973022-0.3283691,0.5844727-0.6560669,0.8708496-0.9835815c0.147644-0.1690063,0.2965698-0.3380737,0.4413452-0.506897  c0.303772-0.3539429,0.5991821-0.7072754,0.8901367-1.0601807c0.1105347-0.1342163,0.2207642-0.2683716,0.3294678-0.4024658  c0.3099976-0.381958,0.6126709-0.7631836,0.9075928-1.1438599c0.0698242-0.090271,0.1384277-0.1804199,0.2073975-0.2706299  c0.3225098-0.4210205,0.6378174-0.8413696,0.9418335-1.2607422c0.0125122-0.0172729,0.0244751-0.0344849,0.0369873-0.0517578  c2.0631714-2.8526001,3.6983032-5.666687,4.906189-8.4345703c0.0025635-0.0058594,0.005249-0.0117798,0.0078125-0.0176392  c0.192627-0.4421997,0.3736572-0.8829956,0.5444946-1.3227539c0.015625-0.0402832,0.03125-0.0805054,0.0467529-0.1207275  c0.1619873-0.4216309,0.3145142-0.8421021,0.4562988-1.2614136c0.0183105-0.0541992,0.0356445-0.1082153,0.0536499-0.1623535  c0.1372681-0.4130859,0.2670898-0.8253784,0.3847656-1.236145c0.0142822-0.0498047,0.0267334-0.0993652,0.0407104-0.1491699  c0.2704468-0.9628296,0.4892578-1.9194946,0.6520386-2.8692017c0.0166626-0.0968628,0.0297241-0.1931763,0.0452881-0.2897949  c0.0697021-0.4356689,0.1297607-0.8700562,0.1767578-1.3028564c0.0162964-0.1484985,0.0293579-0.2965088,0.0429077-0.4445801  c0.0342407-0.3776245,0.0604858-0.7542725,0.0773315-1.1296387c0.0083008-0.1807861,0.0151367-0.3613281,0.0194092-0.5415039  c0.0077515-0.3397827,0.0065308-0.6784058-0.000061-1.0162964c-0.0037842-0.2022095-0.0067139-0.4044189-0.015686-0.605835  c-0.0141602-0.3127441-0.0387573-0.6240234-0.0653076-0.9350586c-0.0183716-0.2174683-0.0334473-0.4353638-0.0578613-0.6519165  c-0.0332642-0.2931519-0.0791626-0.5844727-0.1235352-0.8760376c-0.0344849-0.227356-0.0629272-0.4555664-0.104126-0.6818237  c-0.0507202-0.2774048-0.116272-0.5526123-0.177063-0.8285522c-0.109314-0.4970093-0.2354736-0.991394-0.3777466-1.4832764  c-0.0618286-0.213501-0.1165161-0.4281616-0.1845093-0.640686c-0.0897217-0.2805176-0.1945801-0.5585938-0.295105-0.8374023  c-0.078064-0.2163696-0.1517334-0.4334717-0.2362061-0.6488647c-0.1069336-0.272522-0.2260742-0.5430908-0.3433838-0.8139038  c-0.0955811-0.2207031-0.1895752-0.4416504-0.2921143-0.6611938c-0.1229858-0.2634888-0.255188-0.5254517-0.3881226-0.7872925  c-0.114502-0.2255249-0.2302246-0.4508057-0.3520508-0.6751709c-0.1379395-0.2538452-0.2817993-0.5066528-0.4291992-0.7588501  c-0.1359253-0.2327881-0.276123-0.4649048-0.420105-0.6962891c-0.1500244-0.2410278-0.3027954-0.4815674-0.4615479-0.7210693  c-0.1617432-0.2440796-0.3306885-0.4870605-0.5014648-0.7296143c-0.1585083-0.2250977-0.3164673-0.4501343-0.4827881-0.6738281  c-0.1942139-0.2613525-0.3988037-0.520874-0.6036377-0.7803345c-0.1605835-0.2033081-0.3173218-0.4072876-0.484436-0.609375  c-0.2457886-0.2975464-0.5056152-0.5925903-0.765564-0.8876343c-0.1428223-0.1619873-0.2788086-0.3251953-0.4258423-0.4863892  c-0.4165649-0.4567871-0.8478394-0.9108887-1.2987671-1.3614502c-0.4511108-0.4507446-0.9057617-0.8817749-1.3630371-1.2980957  c-0.1609497-0.1465454-0.3237915-0.2820435-0.4854736-0.4243774c-0.2954102-0.2599487-0.5909424-0.5196533-0.888916-0.7653809  c-0.2044067-0.1687012-0.4107056-0.3270264-0.616333-0.4890747c-0.2559814-0.2015991-0.5118408-0.4031982-0.7696533-0.5944824  c-0.2310791-0.1715698-0.4636841-0.3344727-0.696167-0.4978027c-0.2322998-0.1629639-0.4649048-0.3247681-0.6986694-0.4794312  c-0.2528687-0.1675415-0.5067139-0.3284302-0.7612915-0.4863281c-0.2133789-0.1321411-0.4273682-0.2612305-0.6418457-0.3865967  c-0.2730713-0.159729-0.546936-0.3150024-0.8218994-0.4637451c-0.1933594-0.1044312-0.3873901-0.2039795-0.581604-0.3029175  c-0.2965698-0.1513062-0.5936279-0.2999878-0.8922729-0.4385986c-0.1646729-0.0762939-0.3303223-0.1461792-0.4956665-0.2186279  c-0.328064-0.1438599-0.656311-0.286438-0.9868164-0.4151001c-0.1112061-0.0432129-0.2233887-0.0802002-0.3348389-0.1216431  c-1.7267456-0.6434937-3.4863892-1.0805664-5.2775879-1.3083496c-0.0717163-0.0090942-0.1429443-0.0217896-0.2147217-0.0302124  c-0.3810425-0.0448608-0.7643433-0.0744019-1.1481323-0.1004639c-0.1315308-0.0089722-0.2626953-0.0206909-0.3945312-0.0274658  c-0.3589478-0.0183105-0.7196045-0.0246582-1.0809326-0.0266113c-0.1588745-0.0009155-0.317627-0.0021973-0.4769287,0.0001221  c-0.3473511,0.0050659-0.6958618,0.0186157-1.0453491,0.0387573c-0.175354,0.0100098-0.3510132,0.0222778-0.5269165,0.0361328  C61.4931641,8.15979,61.151062,8.1920166,60.8076172,8.2332764c-0.1850586,0.0221558-0.3707275,0.0492554-0.5562744,0.0755615  c-0.3394165,0.0482788-0.6790161,0.0986938-1.0203247,0.1608276c-0.1879272,0.0341797-0.3768311,0.0756836-0.5652466,0.1140747  c-0.2666016,0.0543213-0.5318604,0.0986328-0.7995605,0.161377c-0.0889893,0.020874-0.1787109,0.0479126-0.2677612,0.0697021  c-0.0471191,0.0115356-0.0944824,0.0251465-0.1416016,0.0369263c-0.4395142,0.1099243-0.880249,0.2305908-1.3222656,0.3630981  c-0.1016846,0.0303955-0.2036133,0.0635376-0.3054199,0.0951538c-0.3893433,0.1211548-0.77948,0.250061-1.1707153,0.3885498  c-0.1287231,0.0455322-0.2575684,0.0925293-0.3864746,0.1399536c-0.3687134,0.1357422-0.7382812,0.2794189-1.1085205,0.430542  c-0.1403198,0.0571899-0.2805786,0.1141357-0.4211426,0.173584c-0.3677979,0.1556396-0.7364502,0.3205566-1.1057739,0.491272  c-0.1373291,0.0634155-0.2744141,0.1246338-0.4120483,0.1901855c-0.3955688,0.1885986-0.7921753,0.3883057-1.1893921,0.5941162  c-0.1080322,0.0559082-0.2156372,0.1079712-0.3237915,0.1652222c-1.0228882,0.5413818-2.0509033,1.1385498-3.0836182,1.7932129  c-0.0808716,0.0512695-0.1622314,0.1070557-0.2431641,0.1590576c-0.4275513,0.2744751-0.8556519,0.5565186-1.284729,0.8503418  c-0.1443481,0.0988159-0.2890625,0.2030029-0.4335327,0.3040161c-0.3688965,0.2578735-0.7380371,0.5202026-1.1079712,0.7922363  c-0.1636963,0.1204224-0.3276978,0.2445679-0.4916382,0.3677979c-0.3557739,0.2672729-0.7119141,0.5400391-1.0686035,0.8203735  c-0.1664429,0.1308594-0.3330688,0.2633057-0.4997559,0.3970337c-0.3615723,0.289978-0.7235718,0.5874023-1.0860596,0.890686  c-0.1588135,0.1329346-0.317627,0.2651978-0.4766846,0.4007568c-0.3808594,0.3245239-0.762207,0.6583862-1.1439819,0.9976196  c-0.1407471,0.125061-0.281189,0.2471924-0.4221191,0.3742676c-0.4266968,0.3848267-0.8540649,0.7810059-1.2817993,1.184082  c-0.097229,0.0916138-0.1942139,0.1791992-0.2915039,0.2717896c-0.5246582,0.4991455-1.0498657,1.0093384-1.5759277,1.5357666  c-0.0068359,0.0068359-0.0129395,0.0135498-0.0197754,0.0203857c-0.0015869,0.0015869-0.0030518,0.0029297-0.0046387,0.0045166  c-0.0419922,0.0420532-0.0796509,0.083252-0.1212769,0.1252441c-0.2819214,0.284729-0.5586548,0.5685425-0.8235474,0.8504639  c-10.4921875,11.1228027-8.0031128,19.8032227-5.5908203,28.2044678c0.4379883,1.5263672,0.8911133,3.1035156,1.2407227,4.6435547  c1.411377,6.2138062-9.6831665,15.3681641-16.1183472,20.4404297c-0.003418,0.0026855-0.006897,0.0054932-0.010376,0.0081787  c-0.427063,0.3366089-0.8336792,0.6552734-1.2145386,0.9537354c-2.4862671,1.9488525-3.7421265,2.9329834-4.2419434,3.6473389  c-0.2999268,0.4285889-0.3276978,0.7601318-0.185791,1.1446533c0.515625,1.3984375,3.402832,4.2929688,3.9677734,4.8505859  c0.5664062,0.5732422,3.4628906,3.4580078,4.8618164,3.9726562c0.144043,0.0527344,0.2807617,0.0820312,0.4179688,0.0820312  c0.8383789,0,1.6938477-1.0927734,4.3710938-4.5146484c0.1809692-0.2312622,0.3699951-0.4725952,0.5599365-0.7148438  c0.0968018-0.1234741,0.1953735-0.2490234,0.2955933-0.3764648c0.0617676-0.0786133,0.1256714-0.1595459,0.1882935-0.2391357  c5.0839233-6.4539185,14.1699219-17.4345703,20.3453369-16.0279541c1.5400391,0.3486328,3.1181641,0.7998047,4.644043,1.2373047  c8.3230591,2.3816528,16.9191284,4.8365479,27.8808594-5.3174438c0.0305786-0.0281982,0.0608521-0.0546875,0.0914917-0.0830688  c0.3952637-0.3682251,0.7929077-0.7490845,1.194458-1.1507568c0.0110474-0.0110474,0.0218506-0.0206909,0.0328979-0.0317383  c0.1708984-0.1710205,0.3305664-0.3412476,0.4985352-0.512085c0.322937-0.3286743,0.6471558-0.6574097,0.9594116-0.9854736  C78.71875,62.9611206,78.9865112,62.6687622,79.2572021,62.3760986z M76.3046875,62.581604  c-0.25354,0.2601929-0.5021973,0.5200195-0.7626953,0.7807007c-0.3057251,0.3060303-0.6086426,0.5984497-0.9099731,0.883667  c-0.232666,0.2194824-0.4636841,0.4304199-0.6939697,0.6376953c-0.0527954,0.0477905-0.1060181,0.0974731-0.1586914,0.1445923  c-8.7016602,7.7466431-15.715332,6.911499-22.1651001,5.2402954l-21.8916016-21.875  c-1.6754761-6.4492188-2.5162354-13.4657593,5.2316284-22.1768799c0.0280151-0.0313721,0.0577393-0.0631714,0.0860596-0.0946045  c0.2253418-0.25177,0.456665-0.5046387,0.6965942-0.7592773c0.2559204-0.2706299,0.5195923-0.5429077,0.7921753-0.8170776  c0.0293579-0.029541,0.0562744-0.0587158,0.0858765-0.0883179c0.5032349-0.5036011,1.0046387-0.9923096,1.5047607-1.4696655  c0.2085571-0.1988525,0.4164429-0.3887939,0.6246338-0.5831299c0.2653198-0.2481079,0.5308228-0.4970093,0.7952271-0.7377319  c0.3727417-0.3383179,0.744812-0.6679688,1.116394-0.9917603c0.0744629-0.0651245,0.1491089-0.1317139,0.2234497-0.196228  c6.0068359-5.1902466,11.8574219-8.4761353,17.4437866-9.786499c7.3111572-1.7164917,14.1943359,0.0159302,20.5079346,5.1390381  c0.0474854,0.0387573,0.0953979,0.0747681,0.1428833,0.1138916c0.3765259,0.309021,0.7501831,0.6351318,1.1226807,0.9683228  c0.0752563,0.0675049,0.1512451,0.1299438,0.2263184,0.1984253c0.4351196,0.395874,0.8676758,0.8070679,1.2970581,1.236084  c0.428772,0.4284668,0.8396606,0.8599854,1.2353516,1.2941895c0.0714111,0.0782471,0.1366577,0.1574707,0.2070312,0.2358398  c0.3311768,0.369873,0.6557617,0.7409058,0.9630127,1.1148682c0.0379028,0.0458984,0.0728149,0.0922241,0.1103516,0.1381836  c5.1296997,6.3110352,6.864563,13.1970825,5.1502686,20.5152588c-1.5130615,6.4595337-5.6629028,13.2751465-12.3432007,20.2804565  C76.7349243,62.1445923,76.5177002,62.3633423,76.3046875,62.581604z M31.8510742,56.4277344  c-0.3190918-1.4046021-0.7154541-2.8114014-1.1098022-4.1890869l4.2699585,4.2667236l-3.1676636,3.1698608  C32.0678711,58.5686646,32.090332,57.4811401,31.8510742,56.4277344z M17.2597656,89.7988281  c-0.8637695-0.5644531-2.4882812-2.0234375-3.7485352-3.2978516c-1.1095581-1.095459-2.3652954-2.4742432-3.0403442-3.380188  c-0.0964355-0.1293945-0.1810303-0.2492065-0.2516479-0.3571167c0.0756836-0.0738525,0.1654053-0.1569214,0.267334-0.2479248  c0.713562-0.637085,2.0253296-1.664917,3.3049316-2.6680908c0.2700806-0.2116699,0.5484619-0.4300537,0.8308716-0.6518555  c0.0533447-0.0418701,0.1063843-0.0836792,0.1602173-0.1259766c0.284729-0.2237549,0.5747681-0.4523926,0.8696289-0.6856689  c0.0093384-0.0073853,0.0183716-0.0145874,0.027771-0.0219727c4.7124023-3.7285156,10.585022-8.6212769,13.8537598-13.5454102  l6.8724976-6.8773193l5.6538086,5.6582031l-6.883606,6.8879395c-4.9067993,3.2685547-9.7800903,9.1183472-13.49823,13.822876  c-0.0283203,0.0358887-0.0559082,0.0708008-0.0841064,0.1064453c-0.2144775,0.2716675-0.4249878,0.5390015-0.6314087,0.802002  c-0.0474243,0.0604248-0.0944214,0.1202393-0.1414185,0.1801147c-0.2202759,0.2809448-0.4371338,0.5578613-0.6474609,0.8265991  C19.0283203,87.6875,17.8505859,89.1923828,17.2597656,89.7988281z M40.3078613,68.164978l3.1888428-3.180481l4.272583,4.2692871  c-1.3775635-0.3931885-2.7851562-0.7890625-4.1901855-1.1072998C42.5181274,67.9075928,41.4225464,67.9343262,40.3078613,68.164978z"
                        clipRule="evenodd"
                    />
                </svg>
              {/* <NextImage
                src={imgSrc}
                alt={`${color} Paddle`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 25vw, 200px"
                style={{
                  filter:
                    color !== "white"
                      ? `hue-rotate(${getHueRotation(color)}deg) saturate(150%)`
                      : "none",
                }}
              /> */}
            </div>
            <div className="mt-2 text-xs text-white/80 capitalize font-medium">
              {color}
            </div>
            {selectedColor === color && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#FFB700] rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-black"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Enhanced Ball Selector
function Balls({
  balls,
  onSelect,
  selectedBall,
}: {
  balls: BallOption[];
  onSelect: (ballImg: string) => void;
  selectedBall: string;
}) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="w-full p-6 bg-black/60 backdrop-blur-sm rounded-2xl shadow-lg">
        <div className="grid grid-cols-4 gap-4">
          {balls.map(({ id, ballImg, name }) => (
            <button
              key={id}
              onClick={() => onSelect(ballImg)}
              className={`
                relative p-3 rounded-2xl transition-all duration-300 transform hover:scale-110
                ${
                  selectedBall === ballImg
                    ? "ring-4 ring-[#FFB700] shadow-lg shadow-[#FFB700]"
                    : "hover:ring-2 hover:ring-white/60 hover:shadow-md"
                }
              `}
              title={name || `Ball ${id + 1}`}
            >
              <div className="relative overflow-hidden rounded-lg aspect-square">
                <NextImage
                  src={ballImg}
                  alt={`Ball ${id + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
              {selectedBall === ballImg && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#FFB700] rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-black"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Enhanced Max Score Selector
function MaxScoreList({
  maxScore,
  onSelect,
  selectedScore,
}: {
  maxScore: { id: number; score: string }[];
  onSelect: (score: string) => void;
  selectedScore: string;
}) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="w-full p-6 bg-black/60 backdrop-blur-sm rounded-2xl shadow-lg">
        <div className="flex flex-col gap-3">
          {maxScore.map(({ id, score }) => (
            <button
              key={id}
              onClick={() => onSelect(score)}
              className={`
                relative py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105
                ${
                  selectedScore === score
                    ? "bg-[#FFB700] text-black ring-4 ring-yellow-400/50 shadow-lg"
                    : "bg-white/10 text-white hover:bg-white/20 hover:shadow-md"
                }
              `}
              title={`Max Score: ${score}`}
            >
              {score} Points
              {selectedScore === score && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Enhanced MiniPong component
function MiniPong({
  paddleColor,
  tableUrl,
  ballUrl,
}: {
  paddleColor: string;
  tableUrl: string;
  ballUrl: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const bgImgRef = useRef<HTMLImageElement | null>(null);
  const ballImgRef = useRef<HTMLImageElement | null>(null);
  const colorRef = useRef<string>(paddleColor);
  const lastTimeRef = useRef<number>(0);

  // Game state with enhanced physics
  const gameStateRef = useRef({
    ball: {
      x: 400,
      y: 300,
      dx: 4,
      dy: 3,
      radius: 12,
      trail: [] as { x: number; y: number; alpha: number }[],
    },
    leftPaddle: { x: 20, y: 250, width: 15, height: 100, targetY: 250 },
    rightPaddle: { x: 765, y: 250, width: 15, height: 100, targetY: 250 },
    particles: [] as {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
    }[],
  });

  // Color ref update
  useEffect(() => {
    colorRef.current = paddleColor;
  }, [paddleColor]);

  // Image loading effects
  useEffect(() => {
    if (!tableUrl) return;

    const img = new window.Image();
    img.src = tableUrl;
    img.onload = () => {
      bgImgRef.current = img;
    };
    img.onerror = () => {
      console.warn("Failed to load table image:", tableUrl);
      bgImgRef.current = null;
    };
  }, [tableUrl]);

  useEffect(() => {
    if (!ballUrl) return;

    const img = new window.Image();
    img.src = ballUrl;
    img.onload = () => {
      ballImgRef.current = img;
    };
    img.onerror = () => {
      console.warn("Failed to load ball image:", ballUrl);
      ballImgRef.current = null;
    };
  }, [ballUrl]);

  // Enhanced game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CANVAS_WIDTH = canvas.width;
    const CANVAS_HEIGHT = canvas.height;

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      const state = gameStateRef.current;

      state.ball.x += state.ball.dx;
      state.ball.y += state.ball.dy;

      // Collisions avec les murs haut et bas
      if (
        state.ball.y - state.ball.radius <= 0 ||
        state.ball.y + state.ball.radius >= CANVAS_HEIGHT
      ) {
        state.ball.dy = -state.ball.dy;
        state.ball.y =
          state.ball.y - state.ball.radius <= 0
            ? state.ball.radius
            : CANVAS_HEIGHT - state.ball.radius;
      }

      // Enhanced AI with smoothing
      state.leftPaddle.targetY = state.ball.y - state.leftPaddle.height / 2;
      state.leftPaddle.y +=
        (state.leftPaddle.targetY - state.leftPaddle.y) * 0.1;
      state.leftPaddle.y = Math.max(
        0,
        Math.min(CANVAS_HEIGHT - state.leftPaddle.height, state.leftPaddle.y)
      );

      state.rightPaddle.targetY = state.ball.y - state.rightPaddle.height / 2;
      state.rightPaddle.y +=
        (state.rightPaddle.targetY - state.rightPaddle.y) * 0.1;
      state.rightPaddle.y = Math.max(
        0,
        Math.min(CANVAS_HEIGHT - state.rightPaddle.height, state.rightPaddle.y)
      );

      // Paddle collisions with enhanced effects
      if (
        state.ball.x - state.ball.radius <=
          state.leftPaddle.x + state.leftPaddle.width &&
        state.ball.y >= state.leftPaddle.y &&
        state.ball.y <= state.leftPaddle.y + state.leftPaddle.height &&
        state.ball.dx < 0
      ) {
        state.ball.dx = -state.ball.dx * 1.05;
        state.ball.dy += (Math.random() - 0.5) * 3;

        for (let i = 0; i < 8; i++) {
          state.particles.push({
            x: state.leftPaddle.x + state.leftPaddle.width,
            y: state.ball.y,
            vx: Math.random() * 6,
            vy: (Math.random() - 0.5) * 8,
            life: 1,
          });
        }
      }

      if (
        state.ball.x + state.ball.radius >= state.rightPaddle.x &&
        state.ball.y >= state.rightPaddle.y &&
        state.ball.y <= state.rightPaddle.y + state.rightPaddle.height &&
        state.ball.dx > 0
      ) {
        state.ball.dx = -state.ball.dx * 1.05;
        state.ball.dy += (Math.random() - 0.5) * 3;

        for (let i = 0; i < 8; i++) {
          state.particles.push({
            x: state.rightPaddle.x,
            y: state.ball.y,
            vx: -Math.random() * 6,
            vy: (Math.random() - 0.5) * 8,
            life: 1,
          });
        }
      }

      // Ball reset on out of bounds
      if (state.ball.x < -50 || state.ball.x > CANVAS_WIDTH + 50) {
        state.ball.x = CANVAS_WIDTH / 2;
        state.ball.y = CANVAS_HEIGHT / 2;
        state.ball.dx = state.ball.x < CANVAS_WIDTH / 2 ? 4 : -4;
        state.ball.dy = (Math.random() - 0.5) * 6;
        state.ball.trail = [];
      }

      // Speed limits
      state.ball.dx = Math.max(-12, Math.min(12, state.ball.dx));
      state.ball.dy = Math.max(-10, Math.min(10, state.ball.dy));

      // Update particles
      state.particles = state.particles.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.2;
        particle.life -= 0.02;
        return particle.life > 0;
      });

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Background
      if (bgImgRef.current?.complete) {
        ctx.drawImage(bgImgRef.current, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      } else {
        const gradient = ctx.createLinearGradient(
          0,
          0,
          CANVAS_WIDTH,
          CANVAS_HEIGHT
        );
        gradient.addColorStop(0, "#1a1a2e");
        gradient.addColorStop(1, "#0f0f23");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      // Center line with glow effect
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 10;
      ctx.strokeStyle = "#fff";
      ctx.setLineDash([15, 15]);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(CANVAS_WIDTH / 2, 0);
      ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;

      // Paddles with glow effect
      ctx.shadowColor = colorRef.current;
      ctx.shadowBlur = 15;
      ctx.fillStyle = colorRef.current;

      drawRoundedRect(
        ctx,
        state.leftPaddle.x,
        state.leftPaddle.y,
        state.leftPaddle.width,
        state.leftPaddle.height,
        8
      );

      drawRoundedRect(
        ctx,
        state.rightPaddle.x,
        state.rightPaddle.y,
        state.rightPaddle.width,
        state.rightPaddle.height,
        8
      );

      ctx.shadowBlur = 0;

      // Ball
      const ballImg = ballImgRef.current;
      const r = state.ball.radius;

      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 20;

      if (ballImg?.complete) {
        drawClippedCircleImage(ctx, ballImg, state.ball.x, state.ball.y, r);
      } else {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(state.ball.x, state.ball.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      // Particles
      state.particles.forEach((particle) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.life})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-2xl">
      <div className="p-6 bg-black/60 backdrop-blur-sm rounded-2xl shadow-2xl">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-full rounded-lg shadow-2xl bg-black border-2 border-white/20"
            style={{ aspectRatio: "4 / 3", maxHeight: "450px" }}
          />
          <div className="absolute top-4 left-4 text-white/80 text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
            Preview
          </div>
        </div>
      </div>
    </div>
  );
}

interface GameSettingsContentProps {
  onClose?: () => void;
}

export default function GameSettingsContent({ onClose }: GameSettingsContentProps) {
  const [customPaddleColor, setCustomPaddleColor] = useState("red");
  const [tableImg, setTableImg] = useState("/images/table1.webp");
  const [ballImg, setBallImg] = useState("/images/Balls/ball1.png");
  const [maxScore, setMaxScore] = useState("5");
  const { setSettings } = useSettings();

  const handleStart = () => {
    setSettings({
      bgTable: tableImg,
      paddle: customPaddleColor,
      score: maxScore,
      ball: ballImg,
    });
    if (onClose) onClose();
  };

  const handleReset = () => {
    setCustomPaddleColor("red");
    setTableImg("/images/table1.webp");
    setBallImg("/images/Balls/ball1.png");
    setMaxScore("5");
    
    // Also reset in context
    setSettings({
      bgTable: "/images/table1.webp",
      paddle: "red",
      score: "5",
      ball: "/images/Balls/ball1.png",
    });
  };

  // Enhanced data with names
  const Pad: PadColor[] = [
    { id: 0, color: "white", imgSrc: "/images/paddle.svg" },
    { id: 1, color: "red", imgSrc: "/images/paddle.svg" },
    { id: 2, color: "green", imgSrc: "/images/paddle.svg" },
    { id: 3, color: "pink", imgSrc: "/images/paddle.svg" },
    { id: 4, color: "purple", imgSrc: "/images/paddle.svg" },
    { id: 5, color: "teal", imgSrc: "/images/paddle.svg" },
    { id: 6, color: "blue", imgSrc: "/images/paddle.svg" },
    { id: 7, color: "fuchsia", imgSrc: "/images/paddle.svg" },
  ];

  const Table: TableBg[] = [
    { id: 0, imgSrc: "/images/table1.webp", name: "Classic Wood" },
    { id: 1, imgSrc: "/images/table2.jpeg", name: "Modern Blue" },
    { id: 2, imgSrc: "/images/table3.webp", name: "Neon Cyber" },
    { id: 3, imgSrc: "/images/table4.jpeg", name: "Retro Green" },
    { id: 4, imgSrc: "/images/table5.png", name: "Space Theme" },
    { id: 5, imgSrc: "/images/table6.png", name: "Ocean Depth" },
    { id: 6, imgSrc: "/images/table7.jpeg", name: "Fire Arena" },
    { id: 7, imgSrc: "/images/table8.jpeg", name: "Ice Palace" },
  ];

  const BallsList: BallOption[] = [
    { id: 0, ballImg: "/images/Balls/ball1.png", name: "Classic" },
    { id: 1, ballImg: "/images/Balls/ball2.png", name: "Fire" },
    { id: 2, ballImg: "/images/Balls/ball3.png", name: "Ice" },
    { id: 3, ballImg: "/images/Balls/ball4.png", name: "Lightning" },
    { id: 4, ballImg: "/images/Balls/ball5.png", name: "Galaxy" },
    { id: 5, ballImg: "/images/Balls/ball6.png", name: "Neon" },
    { id: 6, ballImg: "/images/Balls/ball4.png", name: "Magic" },
    { id: 7, ballImg: "/images/Balls/ball5.png", name: "Crystal" },
  ];

  const ScoreList = [
    { id: 0, score: "3" },
    { id: 1, score: "5" },
    { id: 2, score: "8" },
    { id: 3, score: "10" },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
          Game Settings
        </h1>
        <p className="text-white/70 text-sm md:text-base">
          Customize your Pong experience
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {/* Left Column - Controls */}
        <div className="xl:col-span-2 space-y-4 md:space-y-6 lg:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-center mb-2">
                Paddle Color
              </h3>
              <PadList
                pads={Pad}
                onSelect={setCustomPaddleColor}
                selectedColor={customPaddleColor}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-white font-semibold text-center mb-2">
                Max Score
              </h3>
              <MaxScoreList
                maxScore={ScoreList}
                onSelect={setMaxScore}
                selectedScore={maxScore}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold text-center mb-2">
                Ball Style
              </h3>
              <Balls
                balls={BallsList}
                onSelect={setBallImg}
                selectedBall={ballImg}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold text-center mb-2">
                Table Theme
              </h3>
              <BgTable
                table={Table}
                onSelect={setTableImg}
                selectedTable={tableImg}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="xl:col-span-1">
          <div className="sticky top-8">
            <MiniPong
              paddleColor={customPaddleColor}
              tableUrl={tableImg}
              ballUrl={ballImg}
            />

            {/* Settings Summary */}
            <div className="mt-4 md:mt-6 p-3 md:p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10">
              <h3 className="text-white font-semibold mb-3">
                Current Settings
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/80">
                  <span>Paddle Color:</span>
                  <span
                    className="capitalize font-bold"
                    style={{ color: customPaddleColor }}
                  >
                    {customPaddleColor}
                  </span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Max Score:</span>
                  <span className="font-bold">{maxScore} Points</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Table:</span>
                  <span className="font-bold">
                    {Table.find((t) => t.imgSrc === tableImg)?.name || "Custom"}
                  </span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Ball:</span>
                  <span className="font-bold">
                    {BallsList.find((b) => b.ballImg === ballImg)?.name || "Custom"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleStart}
                  className="flex-1 bg-[#1CBABA] hover:bg-[#159999] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Save
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-[#FFB700] hover:bg-[#E5A500] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
