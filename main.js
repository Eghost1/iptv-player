// HLS is loaded via CDN in index.html

// ============================================
// Constants & DOM Elements
// ============================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ============================================
// ➕ AGREGA TUS CANALES MANUALMENTE AQUÍ
// ============================================
const CUSTOM_CHANNELS = [
  {
    "name": "TNT Sports2",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/TNT_Sports_Chile.svg/1024px-TNT_Sports_Chile.svg.png",
    "group": "Deportes",
    "url": "https://aw1wcm92zq.fubohd.com:443/tntsportschile/mono.m3u8?token=69cb908490ed4fe8f625a9506a97cb6c71ed5a6c-f4-1772495840-1772477840"
  },
  {
    "name": "Disney 2 (Opcion 1 - EnvivosLatam)",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Disney_Channel_logo.svg/1024px-Disney_Channel_logo.svg.png",
    "group": "Deportes",
    "url": "https://yce5o.envivoslatam.org/disney2/tracks-v1a1/mono.m3u8?ip=181.163.94.50&token=7e611ad84c777f1a659943e1ff6031115a51cd5f-f8-1773306886-1773252886"
  },
  {
    "name": "Disney 2 (Opcion 2 - Hotflix)",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Disney_Channel_logo.svg/1024px-Disney_Channel_logo.svg.png",
    "group": "Deportes",
    "url": "https://smjt9q.envivoslatam.org/hotflix/disney2/index.m3u8?token=8a9117a87b3aa9d331a2ac226e224e9a4ccf0aee-0b-1773307412-1773253412&ip=181.163.94.50"
  },
  {
    "name": "Disney 3 (EnvivosLatam)",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Disney_Channel_logo.svg/1024px-Disney_Channel_logo.svg.png",
    "group": "Deportes",
    "url": "https://wf6kt.envivoslatam.org/disney3/tracks-v1a1/mono.m3u8?ip=181.163.94.50&token=0f75bc004e896b18a3fbf21cfb576f48be430410-3d-1773307511-1773253511"
  },
  {
    "name": "Disney 4 (EnvivosLatam)",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Disney_Channel_logo.svg/1024px-Disney_Channel_logo.svg.png",
    "group": "Deportes",
    "url": "https://qbk4f.envivoslatam.org/disney4/tracks-v1a1/mono.m3u8?ip=181.163.94.50&token=fa5d584815d7279798e3c7ae64501225b477ae5e-d4-1773307613-1773253613"
  },
  {
    "name": "TNT Sports Chile (El Canal Deportivo)",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/TNT_Sports_Chile.svg/1024px-TNT_Sports_Chile.svg.png",
    "group": "Deportes",
    "url": "https://elcanaldeportivo.com/cdf.php",
    "iframe": true
  },
  {
    "name": "TNT Sports Chile (Rereyano)",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/TNT_Sports_Chile.svg/1024px-TNT_Sports_Chile.svg.png",
    "group": "Deportes",
    "url": "https://rereyano.ru/player/3/83",
    "iframe": true
  },
  {
    "name": "TNT Sports Chile (We Live Sports)",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/TNT_Sports_Chile.svg/1024px-TNT_Sports_Chile.svg.png",
    "group": "Deportes",
    "url": "https://welivesports.shop/embed/tntsportchile.php",
    "iframe": true
  },
  {
    "name": "TNT Sports Chile (La14HD)",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/TNT_Sports_Chile.svg/1024px-TNT_Sports_Chile.svg.png",
    "group": "Deportes",
    "url": "https://la14hd.com/vivo/canal.php?stream=tntsportschile",
    "iframe": true
  },
  {
    "name": "TyC Sports (Opción 1)",
    "url": "https://tk0hz.envivoslatam.org/tycsports/index.m3u8?token=17a7c31f5eaa26fb0a78543a6692e6917b39dde4-c2-1773308253-1773254253&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Tyc_sports_logo_%282020%29.svg/1024px-Tyc_sports_logo_%282020%29.svg.png",
    "group": "Deportes"
  },
  {
    "name": "TyC Sports (Opción 2)",
    "url": "https://tk0hz.envivoslatam.org/tycsports/tracks-v1a1/mono.m3u8?ip=181.163.94.50&token=17a7c31f5eaa26fb0a78543a6692e6917b39dde4-c2-1773308253-1773254253",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Tyc_sports_logo_%282020%29.svg/1024px-Tyc_sports_logo_%282020%29.svg.png",
    "group": "Deportes"
  },
  {
    "name": "TyC Sports (Hotflix)",
    "url": "https://iaw5b.envivoslatam.org/hotflix/tycsports/index.m3u8?token=17a7c31f5eaa26fb0a78543a6692e6917b39dde4-c2-1773308253-1773254253&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Tyc_sports_logo_%282020%29.svg/1024px-Tyc_sports_logo_%282020%29.svg.png",
    "group": "Deportes"
  },
  {
    "name": "TNT Sports (Hotflix)",
    "url": "https://smjt9q.envivoslatam.org/hotflix/tntsports/index.m3u8?token=14c985e51f0f63e2b946ba729a7f21571604aee6-38-1773308261-1773254261&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/TNT_Sports_Chile.svg/1024px-TNT_Sports_Chile.svg.png",
    "group": "Deportes"
  },
  {
    "name": "TNT Sports (Opción 1)",
    "url": "https://smjt9q.envivoslatam.org/tntsports/tracks-v1a1/mono.m3u8?ip=181.163.94.50&token=14c985e51f0f63e2b946ba729a7f21571604aee6-38-1773308261-1773254261",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/TNT_Sports_Chile.svg/1024px-TNT_Sports_Chile.svg.png",
    "group": "Deportes"
  },
  {
    "name": "TV Pública (Hotflix)",
    "url": "https://rci1w.envivoslatam.org/hotflix/tv_publica/index.m3u8?token=597b723b21a96de1b6bedc8c4b77992924869421-54-1773308270-1773254270&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Logo_de_la_Televisi%C3%B3n_P%C3%BAblica.svg/1024px-Logo_de_la_Televisi%C3%B3n_P%C3%BAblica.svg.png",
    "group": "Deportes"
  },
  {
    "name": "TUDN USA (Opción 1)",
    "url": "https://yce5o.envivoslatam.org/tudn_usa/tracks-v1a1/mono.m3u8?ip=181.163.94.50&token=54d68f4f078ac86e5aeb675965cb0e520950292e-80-1773308286-1773254286",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/TUDN_logo.svg/1024px-TUDN_logo.svg.png",
    "group": "Deportes"
  },
  {
    "name": "TUDN USA (Hotflix)",
    "url": "https://smjt9q.envivoslatam.org/hotflix/tudn_usa/index.m3u8?token=54d68f4f078ac86e5aeb675965cb0e520950292e-80-1773308286-1773254286&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/TUDN_logo.svg/1024px-TUDN_logo.svg.png",
    "group": "Deportes"
  },
  {
    "name": "Fox Sports (Opción 1)",
    "url": "https://yce5o.envivoslatam.org/foxsports/tracks-v1a1/mono.m3u8?ip=181.163.94.50&token=f9a7fbc84528d2ff1bbc1af9378a01ccf7502439-6e-1773308295-1773254295",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Fox_Sports_logo.svg/1024px-Fox_Sports_logo.svg.png",
    "group": "Deportes"
  },
  {
    "name": "Fox Sports (Hotflix)",
    "url": "https://wf6kt.envivoslatam.org/hotflix/foxsports/index.m3u8?token=f9a7fbc84528d2ff1bbc1af9378a01ccf7502439-6e-1773308295-1773254295&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Fox_Sports_logo.svg/1024px-Fox_Sports_logo.svg.png",
    "group": "Deportes"
  },
  {
    "name": "DSports (Hotflix)",
    "url": "https://wf6kt.envivoslatam.org/hotflix/dsports/index.m3u8?token=e3881f524d77731ed02f75541a402153e85aecce-cd-1773308312-1773254312&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/DSports.png/800px-DSports.png",
    "group": "Deportes"
  },
  {
    "name": "DSports (Opción 1)",
    "url": "https://iaw5b.envivoslatam.org/dsports/tracks-v1a1/mono.m3u8?ip=181.163.94.50&token=e3881f524d77731ed02f75541a402153e85aecce-cd-1773308312-1773254312",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/DSports.png/800px-DSports.png",
    "group": "Deportes"
  },
  {
    "name": "ESPN Premium (Hotflix)",
    "url": "https://xky9q.envivoslatam.org/hotflix/espnpremium/index.m3u8?token=9a52c9ceae428495d3af1aaa4c348b612ba47d13-8c-1773308337-1773254337&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/e/e0/ESPN_Premium_logo.png",
    "group": "Deportes"
  },
  {
    "name": "ESPN Premium (Opción 1)",
    "url": "https://mze7u.envivoslatam.org/espnpremium/tracks-v1a1/mono.m3u8?ip=181.163.94.50&token=9a52c9ceae428495d3af1aaa4c348b612ba47d13-8c-1773308337-1773254337",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/e/e0/ESPN_Premium_logo.png",
    "group": "Deportes"
  },
  {
    "name": "Capo Deportes 1",
    "url": "https://n7.sanwalyaarpya.com:1686/hls/capodeportes.m3u8?md5=lZCdQwPccVRq1uiwk4T7aA&expires=1773270577",
    "logo": "",
    "group": "Deportes"
  },
  {
    "name": "Capo Deportes 3",
    "url": "https://n6.sanwalyaarpya.com:1686/hls/capodeportes3.m3u8?md5=Yd9uGsqtkNXNS4yoRUXt0w&expires=1773270591",
    "logo": "",
    "group": "Deportes"
  },
  {
    "name": "Capo Deportes 2",
    "url": "https://n8.sanwalyaarpya.com:1686/hls/capodeportes2.m3u8?md5=BabwblkNX3K5xqCklqVYBw&expires=1773270604",
    "logo": "",
    "group": "Deportes"
  },
  {
    "name": "Televida Ar (Chunks)",
    "url": "https://unlimited1-buenosaires.dps.live/televidaar/televidaar.smil/televidaar/livestream3/chunks.m3u8?nimblesessionid=136479100",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Canal_9_Televida_%28Mendoza%29.png/500px-Canal_9_Televida_%28Mendoza%29.png",
    "group": "Deportes"
  },
  {
    "name": "Televida Ar (Playlist)",
    "url": "https://unlimited1-buenosaires.dps.live/televidaar/televidaar.smil/playlist.m3u8",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Canal_9_Televida_%28Mendoza%29.png/500px-Canal_9_Televida_%28Mendoza%29.png",
    "group": "Deportes"
  },
  {
    "name": "ESPN 2 MX (Streameast)",
    "url": "https://8c51.streameasthd.net/espn2mx/index.m3u8?token=83a9761c996066aa5a9de034a950a392ddf77d80-39-1773308970-1773254970&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/ESPN2_logo.svg/1024px-ESPN2_logo.svg.png",
    "group": "Deportes"
  },
  {
    "name": "ESPN 2 MX (Global)",
    "url": "https://pecdl1.streameasthd.net/global/espn2mx/index.m3u8?token=83a9761c996066aa5a9de034a950a392ddf77d80-39-1773308970-1773254970&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/ESPN2_logo.svg/1024px-ESPN2_logo.svg.png",
    "group": "Deportes"
  },
  {
    "name": "DSports (Fubo)",
    "url": "https://x4bnd7lq.fubohd.com/dsports/mono.m3u8?token=01cfe216bd0be39027af279a00ca7d4404476b37-b1-1773281096-1773263096",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/DSports.png/800px-DSports.png",
    "group": "Deportes"
  },
  {
    "name": "Win Sports (Streameast)",
    "url": "https://24a1.streameasthd.net/winsports/index.m3u8?token=4a2e73362c3517dc464d6d98812d5bbe0ffe50af-0b-1773309056-1773255056&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Win_Sports_Logo.svg/1024px-Win_Sports_Logo.svg.png",
    "group": "Deportes"
  },
  {
    "name": "Win Sports (Global)",
    "url": "https://14c51.streameasthd.net/global/winsports/index.m3u8?token=4a2e73362c3517dc464d6d98812d5bbe0ffe50af-0b-1773309056-1773255056&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Win_Sports_Logo.svg/1024px-Win_Sports_Logo.svg.png",
    "group": "Deportes"
  },
  {
    "name": "Venus Media (Playlist)",
    "url": "https://zn1gen.desdeparaguay.net/venusmedia/venusmedia/playlist.m3u8?k=0a3d82b3e6bda2614baf374016674e9157d2b1dc78debc1024ffa89306c838f3&exp=1773264210",
    "logo": "",
    "group": "Deportes"
  },
  {
    "name": "Venus Media (Chunklist)",
    "url": "https://zn1gen.desdeparaguay.net/venusmedia/venusmedia/chunklist_w791395852.m3u8?k=0a3d82b3e6bda2614baf374016674e9157d2b1dc78debc1024ffa89306c838f3&exp=1773264210",
    "logo": "",
    "group": "Deportes"
  },
  {
    "name": "Fox Deportes USA (Global)",
    "url": "https://8c51.streameasthd.net/global/fox_deportes_usa/index.m3u8?token=18c4d043936811a1040b0304e229aad2df470ea7-38-1773309356-1773255356&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Fox_Deportes_logo.svg/1024px-Fox_Deportes_logo.svg.png",
    "group": "Deportes"
  },
  {
    "name": "Fox Deportes USA",
    "url": "https://8c51.streameasthd.net/fox_deportes_usa/index.m3u8?token=18c4d043936811a1040b0304e229aad2df470ea7-38-1773309356-1773255356&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Fox_Deportes_logo.svg/1024px-Fox_Deportes_logo.svg.png",
    "group": "Deportes"
  },
  {
    "name": "Tubi (Aegis)",
    "url": "https://aegis-cloudfront-1.tubi.video/dc8bda97-ce9e-4091-b4e8-11254dea4da6/playlist.m3u8",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Tubi_logo_%282024%29.svg/1024px-Tubi_logo_%282024%29.svg.png",
    "group": "Deportes"
  },
  {
    "name": "ESPN 4 MX (Global)",
    "url": "https://pecdl1.streameasthd.net/global/espn4mx/index.m3u8?token=26011d36e8d6addd34742524e1c1e8b2bfb77d97-0b-1773309511-1773255511&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/ESPN4_logo_%282024%29.svg/1024px-ESPN4_logo_%282024%29.svg.png",
    "group": "Deportes"
  },
  {
    "name": "ESPN 4 MX",
    "url": "https://pecdl1.streameasthd.net/espn4mx/index.m3u8?token=26011d36e8d6addd34742524e1c1e8b2bfb77d97-0b-1773309511-1773255511&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/ESPN4_logo_%282024%29.svg/1024px-ESPN4_logo_%282024%29.svg.png",
    "group": "Deportes"
  },
  {
    "name": "TUDN USA (Global 2)",
    "url": "https://14c51.streameasthd.net/global/tudn_usa/index.m3u8?token=287c4a35bc65412f9c395eacd94db1cb0eefe39a-8f-1773309519-1773255519&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/TUDN_logo.svg/1024px-TUDN_logo.svg.png",
    "group": "Deportes"
  },
  {
    "name": "TUDN USA (Streameast)",
    "url": "https://doc1.streameasthd.net/tudn_usa/index.m3u8?token=287c4a35bc65412f9c395eacd94db1cb0eefe39a-8f-1773309519-1773255519&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/TUDN_logo.svg/1024px-TUDN_logo.svg.png",
    "group": "Deportes"
  },
  {
    "name": "DSports 2",
    "url": "https://bgfuzq.fubohd.com/dsports2/mono.m3u8?token=77da4ead6f25d8e152295e255b61e9e9a05aaaaf-d2-1773281868-1773263868",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/DSports_2.png/800px-DSports_2.png",
    "group": "Deportes"
  },
  {
    "name": "Univision USA",
    "url": "https://51a1.streameasthd.net/univision_usa/index.m3u8?token=aa8ae0a5e12c2fef18cc0c101d161a55ac105ef0-f1-1773309785-1773255785&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Univision_logo_%282019%29.svg/1024px-Univision_logo_%282019%29.svg.png",
    "group": "Deportes"
  },
  {
    "name": "Univision USA (Global)",
    "url": "https://24a1.streameasthd.net/global/univision_usa/index.m3u8?token=aa8ae0a5e12c2fef18cc0c101d161a55ac105ef0-f1-1773309785-1773255785&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Univision_logo_%282019%29.svg/1024px-Univision_logo_%282019%29.svg.png",
    "group": "Deportes"
  },
  {
    "name": "VTV Plus",
    "url": "https://anvtcax.fubohd.com/vtvplus/mono.m3u8?token=bfa44339893babca67af4d9756e6a1a822d93d2e-5f-1773281937-1773263937",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logotipo_de_VTV_Plus_%282021%29.svg/1024px-Logotipo_de_VTV_Plus_%282021%29.svg.png",
    "group": "Deportes"
  },
  {
    "name": "Canal 5 MX",
    "url": "https://8c51.streameasthd.net/canal5mx/index.m3u8?token=ec5fb75e5943314d5d532ae61754a23c0c9ed10c-ee-1773309973-1773255973&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Canal_5_Mexico_Logo_2016.svg/1024px-Canal_5_Mexico_Logo_2016.svg.png",
    "group": "Deportes"
  },
  {
    "name": "Canal 5 MX (Global)",
    "url": "https://doc1.streameasthd.net/global/canal5mx/index.m3u8?token=ec5fb75e5943314d5d532ae61754a23c0c9ed10c-ee-1773309973-1773255973&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Canal_5_Mexico_Logo_2016.svg/1024px-Canal_5_Mexico_Logo_2016.svg.png",
    "group": "Deportes"
  },
  {
    "name": "ESPN MX",
    "url": "https://24a1.streameasthd.net/espnmx/index.m3u8?token=5fab26f807a30d29a6a22294d828d4aad60c1245-3c-1773309981-1773255981&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/ESPN_logo.svg/1024px-ESPN_logo.svg.png",
    "group": "Deportes"
  },
  {
    "name": "ESPN MX (Global)",
    "url": "https://doc1.streameasthd.net/global/espnmx/index.m3u8?token=5fab26f807a30d29a6a22294d828d4aad60c1245-3c-1773309981-1773255981&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/ESPN_logo.svg/1024px-ESPN_logo.svg.png",
    "group": "Deportes"
  },
  {
    "name": "DSports Plus",
    "url": "https://n13.sanwalyaarpya.com:1686/hls/dsportsplus.m3u8?md5=BYUC529tjlSnTYbP6robzA&expires=1773272286",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/DSports_%2B.png/800px-DSports_%2B.png",
    "group": "Deportes"
  },
  {
    "name": "ESPN Deportes",
    "url": "https://pecdl1.streameasthd.net/espndeportes/index.m3u8?token=0f4394a2c4c20c10e03eb4b6587737b80b60b272-aa-1773310137-1773256137&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/ESPN_Deportes_logo.svg/1024px-ESPN_Deportes_logo.svg.png",
    "group": "Deportes"
  },
  {
    "name": "ESPN Deportes (Global)",
    "url": "https://doc1.streameasthd.net/global/espndeportes/index.m3u8?token=0f4394a2c4c20c10e03eb4b6587737b80b60b272-aa-1773310137-1773256137&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/ESPN_Deportes_logo.svg/1024px-ESPN_Deportes_logo.svg.png",
    "group": "Deportes"
  },
  {
    "name": "Liga 1 Max (Global)",
    "url": "https://pecdl1.streameasthd.net/global/liga1max/index.m3u8?token=50f6ab75ac12dd73d107e0918f630a475d28e5c3-62-1773310145-1773256145&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Logo_de_L1_Max.svg/1024px-Logo_de_L1_Max.svg.png",
    "group": "Deportes"
  },
  {
    "name": "Liga 1 Max",
    "url": "https://24a1.streameasthd.net/liga1max/index.m3u8?token=50f6ab75ac12dd73d107e0918f630a475d28e5c3-62-1773310145-1773256145&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Logo_de_L1_Max.svg/1024px-Logo_de_L1_Max.svg.png",
    "group": "Deportes"
  },
  {
    "name": "Win Plus",
    "url": "https://24a1.streameasthd.net/winplus/index.m3u8?token=7a6276964304bb069ada5d1ebe4bf3428bd2053d-74-1773310188-1773256188&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Win_Sports%2B_Logo.svg/1024px-Win_Sports%2B_Logo.svg.png",
    "group": "Deportes"
  },
  {
    "name": "Win Plus (Global)",
    "url": "https://8c51.streameasthd.net/global/winplus/index.m3u8?token=7a6276964304bb069ada5d1ebe4bf3428bd2053d-74-1773310188-1773256188&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Win_Sports%2B_Logo.svg/1024px-Win_Sports%2B_Logo.svg.png",
    "group": "Deportes"
  },
  {
    "name": "ESPN 3 MX",
    "url": "https://doc1.streameasthd.net/espn3mx/index.m3u8?token=760e5d57a1a9de0cd4fe7230110527a1cb2191b1-51-1773310196-1773256196&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/ESPN3_logo.svg/1024px-ESPN3_logo.svg.png",
    "group": "Deportes"
  },
  {
    "name": "ESPN 3 MX (Global)",
    "url": "https://8c51.streameasthd.net/global/espn3mx/index.m3u8?token=760e5d57a1a9de0cd4fe7230110527a1cb2191b1-51-1773310196-1773256196&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/ESPN3_logo.svg/1024px-ESPN3_logo.svg.png",
    "group": "Deportes"
  },
  {
    "name": "Universo (Global)",
    "url": "https://doc1.streameasthd.net/global/universo/index.m3u8?token=5992165a8f9ea33d750de6deeb6ffe9f3b227d8b-d2-1773310257-1773256257&ip=181.163.94.50",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Universo_logo.svg/1024px-Universo_logo.svg.png",
    "group": "Deportes"
  }
];

const processedCustomChannels = CUSTOM_CHANNELS.map(ch => ({
  ...ch,
  source: 'custom',
  uid: `${ch.name}-${ch.url}`.replace(/\s+/g, '-').toLowerCase()
}));

// Added la14hd dynamic proxy (via allorigins to bypass CORS if needed, or direct)
const LA14HD_JSON_URL = 'https://corsproxy.io/?url=https://www.la14hd.com/status.json';
// Added LibreFutbolTV dynamic proxy
const LIBRE_AGENDA_URL = 'https://corsproxy.io/?url=https://librefutboltv.su/home1/agenda/';
// Added RojaDirectaTV dynamic proxy
const ROJADIRECTA_URL = 'https://corsproxy.io/?url=https://www.rojadirectatv3.pl/';

const PLAYLISTS = {
  sports: 'https://iptv-org.github.io/iptv/categories/sports.m3u',
  chile: 'https://iptv-org.github.io/iptv/countries/cl.m3u',
  Chile2: 'https://m3u.cl/lista/CL.m3u',
  tnt_sports_chile: '', // Deprecated placeholder or empty
  c1: 'https://pastebin.com/raw/wCnH-1-d3port3s-CDX2',
  c2: 'https://pastebin.com/raw/sfym-nbaa–2SDK',
  c3: 'https://pastebin.com/raw/K-futbol211VtaQaMC',
  c4: 'http://bit.ly/futbol1onlin33-applil',
  c5: 'http://bit.ly/deportes1general33-applil',
  c6: 'http://bit.ly/Deportes1Ymasyaj12'
};

// ============================================
// Cookie Helpers
// ============================================
function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value || ""}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

const state = {
  channels: [],
  sportsChannels: [],
  chileChannels: [],
  customChannels: processedCustomChannels,
  currentFilter: 'all',
  categories: [],
  currentChannel: null,
  favorites: JSON.parse(getCookie('iptv-favorites') || localStorage.getItem('iptv-favorites') || '[]'),
  hls: null,
};

const els = {
  channelList: $('#channel-list'),
  categoryFilters: $('#category-filters'),
  loading: $('#loading'),
  searchInput: $('#search-input'),
  videoPlayer: $('#video-player'),
  iframePlayer: $('#iframe-player'),
  playerEmpty: $('#player-empty'),
  playerError: $('#player-error'),
  playerContainer: $('#player-container'),
  nowPlaying: $('#now-playing'),
  nowPlayingLogo: $('#now-playing-logo'),
  nowPlayingName: $('#now-playing-name'),
  nowPlayingGroup: $('#now-playing-group'),
  btnFavorite: $('#btn-favorite'),
  countSports: $('#count-sports'),
  countChile: $('#count-chile'),
};

// ============================================
// M3U Parser
// ============================================
function parseM3U(text, source) {
  const lines = text.split('\n');
  const channels = [];
  let currentInfo = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('#EXTINF:')) {
      const nameMatch = line.match(/,(.+)$/);
      const logoMatch = line.match(/tvg-logo="([^"]*)"/);
      const groupMatch = line.match(/group-title="([^"]*)"/);
      const idMatch = line.match(/tvg-id="([^"]*)"/);

      currentInfo = {
        name: nameMatch ? nameMatch[1].trim() : 'Sin nombre',
        logo: logoMatch ? logoMatch[1] : '',
        group: groupMatch ? groupMatch[1].trim() : 'Sin Categoría',
        id: idMatch ? idMatch[1] : '',
        source,
      };
    } else if (line && !line.startsWith('#') && currentInfo) {
      channels.push({
        ...currentInfo,
        url: line,
        uid: `${currentInfo.name}-${line}`.replace(/\s+/g, '-').toLowerCase(),
      });
      currentInfo = null;
    }
  }

  return channels;
}

// ============================================
// Fetch Channels
// ============================================
async function fetchPlaylist(url, source) {
  if (!url) return [];
  try {
    const isCorsProblematic = url.startsWith('http://') || url.includes('pastebin.com') || url.includes('m3u.cl') || url.includes('bit.ly');
    const targetUrl = isCorsProblematic ? `https://corsproxy.io/?url=${encodeURIComponent(url)}` : url;

    const res = await fetch(targetUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return parseM3U(text, source);
  } catch (err) {
    console.error(`Error fetching ${source}:`, err);
    return [];
  }
}

async function loadChannels() {
  els.loading.style.display = 'flex';

  const fetchJson = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  };

  const fetchText = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.text();
    } catch (e) {
      return null;
    }
  };

  const [
    sports, chile, chile2, tnt_sports_chile,
    c1, c2, c3, c4, c5, c6,
    la14hdJson, libreHtml, rojaHtml
  ] = await Promise.all([
    fetchPlaylist(PLAYLISTS.sports, 'sports'),
    fetchPlaylist(PLAYLISTS.chile, 'chile'),
    fetchPlaylist(PLAYLISTS.Chile2, 'chile2'),
    fetchPlaylist(PLAYLISTS.tnt_sports_chile, 'tnt_sports_chile'),
    fetchPlaylist(PLAYLISTS.c1, 'sports'),
    fetchPlaylist(PLAYLISTS.c2, 'sports'),
    fetchPlaylist(PLAYLISTS.c3, 'sports'),
    fetchPlaylist(PLAYLISTS.c4, 'sports'),
    fetchPlaylist(PLAYLISTS.c5, 'sports'),
    fetchPlaylist(PLAYLISTS.c6, 'sports'),
    fetchJson(LA14HD_JSON_URL),
    fetchText(LIBRE_AGENDA_URL),
    fetchText(ROJADIRECTA_URL)
  ]);

  state.sportsChannels = [...sports, ...c1, ...c2, ...c3, ...c4, ...c5, ...c6];
  state.chileChannels = chile;
  state.Chile2Channels = chile2;
  state.tnt_sports_chileChannels = tnt_sports_chile;

  let la14hdChannels = [];
  if (la14hdJson) {
    for (const group in la14hdJson) {
      const items = la14hdJson[group];
      if (Array.isArray(items)) {
        items.forEach(item => {
          if (item.Estado === "Activo" && item.Link) {
            la14hdChannels.push({
              name: item.Canal + " (la14hd)",
              logo: '',
              group: group,
              url: item.Link,
              iframe: true,
              source: 'custom',
              uid: `la14hd-${item.Canal}-${item.Link}`.replace(/\s+/g, '-').toLowerCase()
            });
          }
        });
      }
    }
  }

  let libreChannels = [];
  if (libreHtml) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(libreHtml, 'text/html');
      const events = doc.querySelectorAll('li');
      events.forEach(eventLi => {
        let eventName = "";
        Array.from(eventLi.childNodes).forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "") eventName += node.textContent.trim() + " ";
        });
        eventName = eventName.trim() || 'Evento LibreFutbol';

        const links = eventLi.querySelectorAll('a');
        links.forEach(link => {
          const href = link.getAttribute('href') || '';
          let channelName = link.textContent.trim().replace('Calidad 720p', '').replace('Calidad 1080p', '').trim();
          if (!channelName) channelName = eventName;
          const rMatch = href.match(/\?r=([A-Za-z0-9+/=]+)/);
          if (rMatch && rMatch[1]) {
            try {
              const decodedUrl = atob(rMatch[1]);
              if (decodedUrl.includes('http') || decodedUrl.includes('.php') || decodedUrl.includes('.html')) {
                libreChannels.push({
                  name: `${channelName} (${eventName}) [Libre]`,
                  logo: '',
                  group: 'LibreFutbolTV',
                  url: decodedUrl,
                  iframe: true,
                  source: 'custom',
                  uid: `libre-${channelName}-${decodedUrl}`.replace(/\s+/g, '-').toLowerCase()
                });
              }
            } catch (e) { }
          }
        });
      });
    } catch (e) { }
  }

  let rojaChannels = [];
  if (rojaHtml) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rojaHtml, 'text/html');
      const events = doc.querySelectorAll('li');

      events.forEach(eventLi => {
        let eventName = eventLi.textContent.split('\n')[0].trim() || 'Evento RojaDirecta';
        eventName = eventName.replace(/Canal.*/g, '').trim();

        const links = eventLi.querySelectorAll('a');
        links.forEach((link, idx) => {
          const href = link.getAttribute('href') || '';
          const channelName = link.textContent.trim() || `Opcion ${idx + 1}`;
          let finalUrl = href;
          if (href.startsWith('/')) finalUrl = 'https://www.rojadirectatv3.pl' + href;
          else if (!href.startsWith('http')) finalUrl = 'https://www.rojadirectatv3.pl/' + href;

          if (href && !href.includes('agenda.php') && !href.includes('legal.php')) {
            rojaChannels.push({
              name: `${channelName} (${eventName}) [Roja]`,
              logo: '',
              group: 'RojaDirectaTV',
              url: finalUrl,
              iframe: true,
              source: 'custom',
              uid: `roja-${channelName}-${finalUrl}`.replace(/\s+/g, '-').toLowerCase()
            });
          }
        });
      });
    } catch (e) { }
  }

  state.customChannels = [...processedCustomChannels, ...la14hdChannels, ...libreChannels, ...rojaChannels];

  const allMap = new Map();
  [...state.sportsChannels, ...chile, ...chile2, ...tnt_sports_chile, ...state.customChannels].forEach((ch) => {
    if (!allMap.has(ch.uid)) {
      if (!ch.group || ch.group.trim() === '') ch.group = 'Otros';
      allMap.set(ch.uid, ch);
    }
  });
  state.channels = Array.from(allMap.values());

  els.countSports.textContent = state.sportsChannels.length;
  els.countChile.textContent = chile.length;

  const categories = new Set(state.channels.map(ch => ch.group));
  state.categories = Array.from(categories).sort();

  els.loading.style.display = 'none';
  renderCategoryPills();
  renderChannels();
}

// ============================================
// Render UI
// ============================================
function renderCategoryPills() {
  let html = `<button class="category-pill ${state.currentFilter === 'all' ? 'active' : ''}" data-group="all" tabindex="0">Todo</button>`;
  html += `<button class="category-pill ${state.currentFilter === 'favorites' ? 'active' : ''}" data-group="favorites" tabindex="0">⭐ Favoritos</button>`;

  const priorityGroups = ['Deportes', 'RojaDirectaTV', 'LibreFutbolTV'];

  priorityGroups.forEach(g => {
    if (state.categories.includes(g)) {
      html += `<button class="category-pill ${state.currentFilter === g ? 'active' : ''}" data-group="${g}" tabindex="0">${g}</button>`;
    }
  });

  state.categories.forEach(g => {
    if (!priorityGroups.includes(g) && g.length < 25) {
      html += `<button class="category-pill ${state.currentFilter === g ? 'active' : ''}" data-group="${g}" tabindex="0">${g}</button>`;
    }
  });

  if (els.categoryFilters) {
    els.categoryFilters.innerHTML = html;
  }
}

function getFilteredChannelsGrouped() {
  let filtered = state.channels;

  if (state.currentFilter === 'favorites') {
    filtered = filtered.filter(ch => state.favorites.includes(ch.uid));
  } else if (state.currentFilter !== 'all') {
    filtered = filtered.filter(ch => ch.group === state.currentFilter);
  }

  const query = els.searchInput.value.toLowerCase().trim();
  if (query) {
    filtered = filtered.filter(ch =>
      ch.name.toLowerCase().includes(query) || ch.group.toLowerCase().includes(query)
    );
  }

  const grouped = {};
  filtered.forEach(ch => {
    if (!grouped[ch.group]) grouped[ch.group] = [];
    grouped[ch.group].push(ch);
  });

  return grouped;
}

function renderChannels() {
  const grouped = getFilteredChannelsGrouped();

  if (Object.keys(grouped).length === 0) {
    els.channelList.innerHTML = `
      <div class="no-results">
        <div class="no-results__icon">📂</div>
        <p>No se encontraron canales en esta categoría</p>
      </div>
    `;
    return;
  }

  let html = '';
  let animDelay = 0;

  for (const [group, channels] of Object.entries(grouped)) {
    if (state.currentFilter === 'all' || state.currentFilter === 'favorites' || els.searchInput.value.trim() !== '') {
      html += `<h3 class="category-group-title">${group}</h3>`;
    }

    html += `<div class="category-group-grid">`;
    channels.forEach((ch) => {
      const isFav = state.favorites.includes(ch.uid);
      const isActive = state.currentChannel?.uid === ch.uid;
      const initial = ch.name.charAt(0).toUpperCase();

      animDelay += 0.02;
      const delayStyle = `animation-delay: ${Math.min(animDelay, 0.5)}s;`;

      html += `
        <div class="channel-card ${isActive ? 'active' : ''}" data-uid="${ch.uid}" tabindex="0" role="button" aria-label="Reproducir ${ch.name}" style="${delayStyle}">
          ${ch.logo
          ? `<img class="channel-card__logo" src="${ch.logo}" alt="${ch.name}" loading="lazy" onerror="this.outerHTML='<div class=\'channel-card__logo-placeholder\'>${initial}</div>'" />`
          : `<div class="channel-card__logo-placeholder">${initial}</div>`
        }
          <div class="channel-card__info">
            <div class="channel-card__name" title="${ch.name}">${ch.name}</div>
          </div>
          <button class="channel-card__fav ${isFav ? 'is-fav' : ''}" data-fav-uid="${ch.uid}" title="${isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
            ${isFav ? '★' : '☆'}
          </button>
        </div>
      `;
    });
    html += `</div>`;
  }

  els.channelList.innerHTML = html;
}

// ============================================
// Video Playback
// ============================================
function playChannel(channel) {
  state.currentChannel = channel;

  els.playerEmpty.style.display = 'none';
  els.playerError.style.display = 'none';
  els.nowPlaying.style.display = 'flex';

  const isIframe = channel.iframe || channel.url.endsWith('.html') || channel.url.endsWith('.php');

  if (isIframe) {
    els.videoPlayer.classList.remove('visible');
    els.videoPlayer.pause();
    els.iframePlayer.src = channel.url;
    els.iframePlayer.style.display = 'block';
    els.iframePlayer.classList.add('visible');
  } else {
    els.iframePlayer.src = 'about:blank';
    els.iframePlayer.style.display = 'none';
    els.iframePlayer.classList.remove('visible');
    els.videoPlayer.classList.add('visible');
  }

  els.nowPlayingName.textContent = channel.name;
  els.nowPlayingGroup.textContent = channel.group || channel.source;
  if (channel.logo) {
    els.nowPlayingLogo.src = channel.logo;
    els.nowPlayingLogo.style.display = 'block';
  } else {
    els.nowPlayingLogo.style.display = 'none';
  }

  updateFavoriteButton();

  if (window.innerWidth <= 1024) {
    els.playerContainer.scrollIntoView({ behavior: 'smooth' });
  }

  if (state.hls) {
    state.hls.destroy();
    state.hls = null;
  }

  if (isIframe) {
    renderChannels();
    return;
  }

  const url = channel.url;
  const video = els.videoPlayer;

  if (url.includes('.m3u8') || url.includes('m3u8')) {
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        // Incrementamos el buffer para compensar pesos altísimos de segmentos en Max Quality
        maxBufferLength: 60,
        maxMaxBufferLength: 120,
        // Prevenimos que Hls baje de calidad si el buffer se queda corto momentaneamente
        capLevelToPlayerSize: false,
        abrEwmaDefaultEstimate: 5000000, // Partimos "asumiendo" una conexión veloz
        // Interceptar cada petición de video (m3u8 o ts)
        xhrSetup: function (xhr, internalUrl) {
          console.log('[Depuración HLS] Solicitando recurso:', internalUrl);

          // Opcional: Si un CDN bloquea por CORS, puedes intentar forzar el proxy también para los fragmentos (.ts)
          // Nota: corsproxy.io bloquea archivos pesados de video a veces, usar con precaución.
          if (internalUrl.includes('.ts') || internalUrl.includes('.m3u8')) {
            internalUrl = 'https://corsproxy.io/?url=' + encodeURIComponent(internalUrl);
          }

        }
      });
      state.hls = hls;
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        console.log('[Depuración HLS] Manifiesto cargado exitosamente. Seleccionando la mayor calidad...');
        
        // Buscar el índice del nivel de mayor calidad (basado en bitrate o resolución)
        let maxQualityLevel = -1;
        let highestBitrate = 0;
        
        if (data.levels && data.levels.length > 0) {
           data.levels.forEach((level, index) => {
              if (level.bitrate > highestBitrate) {
                 highestBitrate = level.bitrate;
                 maxQualityLevel = index;
              }
           });
        }

        // Forzar la calidad si encontramos múltiples niveles
        if(maxQualityLevel > -1) {
           console.log(`[Depuración HLS] Forzando nivel de calidad: ${maxQualityLevel} (Bitrate: ${Math.round(highestBitrate / 1000)}kbps)`);
           hls.currentLevel = maxQualityLevel; // Deshabilita el auto-switch y fija esa calidad
        }

        video.play().catch(() => { });
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('[Depuración HLS ERROR]', data.type, data.details, data);
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            console.warn('[Depuración HLS] Error de red fatal, intentando recargar...', data.frag?.url);
            hls.startLoad();
          }
          else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            console.warn('[Depuración HLS] Error de medios fatal, intentando recuperar...');
            hls.recoverMediaError();
          }
          else showPlayError();
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.play().catch(() => { });
    } else showPlayError();
  } else {
    video.src = url;
    video.play().catch(() => { });
    video.onerror = () => showPlayError();
  }

  renderChannels();
}

function showPlayError() {
  els.videoPlayer.classList.remove('visible');
  if (els.iframePlayer) els.iframePlayer.style.display = 'none';
  els.playerError.style.display = 'block';
}

// ============================================
// Favorites
// ============================================
function toggleFavorite(uid) {
  const idx = state.favorites.indexOf(uid);
  if (idx >= 0) state.favorites.splice(idx, 1);
  else state.favorites.push(uid);

  setCookie('iptv-favorites', JSON.stringify(state.favorites), 365);
  localStorage.setItem('iptv-favorites', JSON.stringify(state.favorites));

  updateFavoriteButton();
  renderChannels();
}

function updateFavoriteButton() {
  if (!state.currentChannel) return;
  const isFav = state.favorites.includes(state.currentChannel.uid);
  els.btnFavorite.classList.toggle('is-fav', isFav);
}

// ============================================
// Event Listeners
// ============================================
function setupListeners() {
  els.channelList.addEventListener('click', (e) => {
    const favBtn = e.target.closest('[data-fav-uid]');
    if (favBtn) {
      e.stopPropagation();
      toggleFavorite(favBtn.dataset.favUid);
      return;
    }
    const card = e.target.closest('.channel-card');
    if (card) {
      const uid = card.dataset.uid;
      const channel = state.channels.find((ch) => ch.uid === uid);
      if (channel) playChannel(channel);
    }
  });

  if (els.categoryFilters) {
    els.categoryFilters.addEventListener('click', (e) => {
      const pill = e.target.closest('.category-pill');
      if (pill) {
        state.currentFilter = pill.dataset.group;
        renderCategoryPills();
        renderChannels();
        els.channelList.scrollTop = 0;
      }
    });
  }

  let searchTimeout;
  els.searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      renderChannels();
    }, 200);
  });

  els.btnFavorite.addEventListener('click', () => {
    if (state.currentChannel) toggleFavorite(state.currentChannel.uid);
  });
}

// Global Keyboard navigation logic for D-pad (Smart TVs/Arrows)
document.addEventListener('keydown', (e) => {
  // Prevenir que el scroll natural del navegador arruine el foco
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }

  // Escape to clear search
  if (e.key === 'Escape') {
    els.searchInput.value = '';
    renderChannels();
    return;
  }
  
  // Ctrl+K / Cmd+K to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    els.searchInput.focus();
    return;
  }

  const actEl = document.activeElement;
  if (!actEl) {
     if(e.key === 'ArrowDown' || e.key === 'ArrowRight') els.searchInput.focus();
     return;
  }

  // --- Acción OK / Enter ---
  if (e.key === 'Enter') {
    if (actEl.classList.contains('category-pill')) {
      actEl.click();
    } else {
      const card = actEl.closest('.channel-card');
      if (card) {
        const uid = card.dataset.uid;
        const channel = state.channels.find((ch) => ch.uid === uid);
        if (channel) playChannel(channel);
      }
    }
    return;
  }

  // --- Lógica de Movimiento ---
  const isSearch = actEl === els.searchInput;
  const isPill = actEl.classList.contains('category-pill');
  const isCard = actEl.closest('.channel-card') !== null;

  if (isSearch) {
    if (e.key === 'ArrowDown') {
      const activePill = document.querySelector('.category-pill.active') || document.querySelector('.category-pill');
      if (activePill) activePill.focus();
    }
  } 
  else if (isPill) {
    const pills = Array.from(document.querySelectorAll('.category-pill'));
    const idx = pills.indexOf(actEl);
    
    if (e.key === 'ArrowRight' && idx < pills.length - 1) pills[idx + 1].focus();
    else if (e.key === 'ArrowLeft' && idx > 0) pills[idx - 1].focus();
    else if (e.key === 'ArrowUp') els.searchInput.focus();
    else if (e.key === 'ArrowDown') {
      const firstCard = els.channelList.querySelector('.channel-card');
      if (firstCard) {
        firstCard.focus();
        firstCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  } 
  else if (isCard) {
    const cards = Array.from(els.channelList.querySelectorAll('.channel-card'));
    const parentCard = actEl.closest('.channel-card');
    const currentIndex = cards.indexOf(parentCard);
    
    if (currentIndex === -1) return;

    const cardRect = parentCard.getBoundingClientRect();
    const rowCards = cards.filter(c => {
      const rect = c.getBoundingClientRect();
      return Math.abs(rect.top - cardRect.top) < 20; 
    });
    
    const cardsPerRow = rowCards.length;
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight') nextIndex = currentIndex + 1;
    else if (e.key === 'ArrowLeft') nextIndex = currentIndex - 1;
    else if (e.key === 'ArrowDown') nextIndex = currentIndex + cardsPerRow;
    else if (e.key === 'ArrowUp') nextIndex = currentIndex - cardsPerRow;

    if (cards[nextIndex]) {
      cards[nextIndex].focus();
      cards[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (e.key === 'ArrowUp' && currentIndex < cardsPerRow) {
      // Subir desde primera fila de canales te lleva a las categorías
      const activePill = document.querySelector('.category-pill.active') || document.querySelector('.category-pill');
      if (activePill) activePill.focus();
    }
  }
});
// ============================================
// Initialize
// ============================================
async function init() {
  setupListeners();
  await loadChannels();
  
  // Set initial focus for Smart TVs
  if (els.searchInput) els.searchInput.focus();
}

init();
