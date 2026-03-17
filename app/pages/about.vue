<template>
    <div class="page-wrapper">
        <NavBar />

        <!-- Page Hero -->
        <section class="page-hero">
            <div class="ph-overlay"></div>
            <img src="https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1920&h=400&fit=crop" alt="About Us"
                class="ph-bg" />
            <div class="ph-content">
                <p class="ph-label">Who We Are</p>
                <h1>About Light City</h1>
                <p class="ph-sub">A community of believers committed to loving God and making disciples.</p>
            </div>
        </section>

        <!-- LCECI Introduction -->
        <section class="lceci-section">
            <div class="container">
                <div class="lceci-header">
                    <span class="section-label">Introduction</span>
                    <h2>Light City Evangelical Center International</h2>
                    <p class="lceci-intro">Light City Evangelical Center (LCECI) is a non-denominational Christian
                        Ministry — a part of the body of Christ striving to contribute its best to properly and
                        accurately build up the saints, and edify the Church of Jesus Christ for the work of ministry
                        in the present day Church. We are a team of visionary Christians from different denominations,
                        with a passion to reach the unreached with the true gospel of our Lord Jesus Christ, to save
                        souls and win the lost back to the kingdom of God. Our message is the pure gospel of
                        redemption, salvation, righteousness and sanctification.</p>
                </div>

                <!-- Who We Are -->
                <div class="lceci-who">
                    <p>Our purpose and goal is to raise visionary, purpose-driven Christians, full of the Holy Spirit
                        and manifesting the power and gifts of the Spirit in various dimensions. Light City Evangelical
                        Center is strongly rooted in the ministry of the Word, which gave rise to its slogan:
                        <em>"The Word of God Works."</em> We are strongly confident in the efficacy of the Word of God
                        and the Ministry of the blood of Jesus Christ which has atoned for everyone who believes.
                    </p>
                </div>

                <!-- Subsections with videos -->
                <div class="lceci-subsections">

                    <!-- Our Vision -->
                    <div class="lceci-sub">
                        <div class="lceci-sub-text">
                            <h3>
                                <Icon name="mdi:road" class="sub-icon" /> Reaching the unreached
                            </h3>
                            <p>Reaching the unreached with the gospel of our Lord Jesus Christ, especially in rural and
                                forgotten areas where the gospel is scarce. The first and most important goal of Light
                                City is to spread the true and unadulterated gospel of Jesus Christ to the ends of the
                                earth.</p>
                            <p>We seek out remote villages and areas that are neglected and forgotten, to bring them
                                the gospel that is able to save them and bring them out of darkness into the marvelous
                                light of God. Light City also conducts evangelism outreaches in urban areas, schools,
                                institutions, and every place where souls may be found.</p>
                        </div>
                        <div class="lceci-sub-video">
                            <div class="video-embed-wrap" v-if="getEmbedUrl(introVideos[0])">
                                <iframe :src="getEmbedUrl(introVideos[0])" title="Mission Outreaches" frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen class="video-iframe"></iframe>
                            </div>
                            <div class="video-placeholder" v-else>
                                <Icon name="mdi:play-circle-outline" />
                                <span>Mission Outreaches</span>
                            </div>
                        </div>
                    </div>

                    <!-- Discipleship -->
                    <div class="lceci-sub reverse">
                        <div class="lceci-sub-text">
                            <h3>
                                <Icon name="mdi:account-group" class="sub-icon" /> Discipleship
                            </h3>
                            <p>We raise leaders and missionaries who will carry the vision of the ministry to the ends
                                of the earth. Light City does not only preach and leave new converts to their fate —
                                rather we put them through a period of discipleship, raising them from mere babes in
                                the kingdom into leaders and purpose-driven missionaries.</p>
                            <p>Wherever Light City disciples find themselves, they become like the early Christians who
                                went about doing exploits and spreading the message of Christ. Light City raises men
                                who will go to their vicinity, their churches and communities to depopulate the kingdom
                                of darkness.</p>
                        </div>
                        <div class="lceci-sub-video">
                            <div class="video-embed-wrap" v-if="getEmbedUrl(introVideos[1])">
                                <iframe :src="getEmbedUrl(introVideos[1])" title="Discipleship" frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen class="video-iframe"></iframe>
                            </div>
                            <div class="video-placeholder" v-else>
                                <Icon name="mdi:play-circle-outline" />
                                <span>Discipleship</span>
                            </div>
                        </div>
                    </div>

                    <!-- Manifestation of the Kingdom -->
                    <div class="lceci-sub">
                        <div class="lceci-sub-text">
                            <h3>
                                <Icon name="mdi:fire" class="sub-icon" /> Manifestation of the Kingdom
                            </h3>
                            <p>Through its various programs and outreaches, Light City has brought diverse healings
                                from all kinds of diseases, deliverance from bondage and captivity of the evil one,
                                breaking of yokes of poverty, freedom from demonic oppressions, and family and
                                community liberations to numerous people.</p>
                            <p>Our strong faith and dependence on the Word of God and the manifestation of the power
                                of the Holy Spirit has made Light City a driving force in bringing freedom to the
                                oppressed. We have recorded diverse testimonies of spiritual freedoms, various kinds of
                                healing and financial prosperities.</p>
                        </div>
                        <div class="lceci-sub-video">
                            <div class="video-embed-wrap" v-if="getEmbedUrl(introVideos[2])">
                                <iframe :src="getEmbedUrl(introVideos[2])" title="Kingdom Manifestations"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen class="video-iframe"></iframe>
                            </div>
                            <div class="video-placeholder" v-else>
                                <Icon name="mdi:play-circle-outline" />
                                <span>Kingdom Manifestations</span>
                            </div>
                        </div>
                    </div>

                    <!-- Prophetic Intercession -->
                    <div class="lceci-sub reverse">
                        <div class="lceci-sub-text">
                            <h3>
                                <Icon name="mdi:hands-pray" class="sub-icon" /> Raising Prophetic Intercessors
                            </h3>
                            <p>Light City believes in the words of Jesus in Luke 18:1 — "men ought to pray and not
                                faint" — and so we have systematically raised prophetic intercessors who stand in the
                                gap and bring down the government of God upon the earth in the place of prayer.</p>
                            <p>Our aim is to tarry in the secret place until the Word of God comes to pass in the
                                lives of men and in the world at large. We never embark on any mission outreach or
                                program without intensive prayer sessions to bring down strongholds that may oppose the
                                mandate from being fulfilled.</p>
                        </div>
                        <div class="lceci-sub-video">
                            <div class="video-embed-wrap" v-if="getEmbedUrl(introVideos[3])">
                                <iframe :src="getEmbedUrl(introVideos[3])" title="Prophetic Intercession"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen class="video-iframe"></iframe>
                            </div>
                            <div class="video-placeholder" v-else>
                                <Icon name="mdi:play-circle-outline" />
                                <span>Prophetic Intercession</span>
                            </div>
                        </div>
                    </div>

                    <!-- School of Mission -->
                    <div class="lceci-sub">
                        <div class="lceci-sub-text">
                            <h3>
                                <Icon name="mdi:school" class="sub-icon" /> School of Mission and Evangelism
                            </h3>
                            <p>Light City runs a school of mission and evangelism where eligible people who are willing
                                and ready to dedicate their time to fulfilling the mission mandate are trained — from
                                the foundations of faith to the deeper bible-based principles of the Christian life
                                that guide a worker in God's vineyard.</p>
                            <p>This school system qualifies its participants to partake in our mission outreaches,
                                regardless of their denomination. We partner with every bible-believing church or
                                ministry that shares the desire to see the heartbeat of God fulfilled.</p>
                        </div>
                        <div class="lceci-sub-video">
                            <div class="video-embed-wrap" v-if="getEmbedUrl(introVideos[4])">
                                <iframe :src="getEmbedUrl(introVideos[4])" title="School of Mission" frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen class="video-iframe"></iframe>
                            </div>
                            <div class="video-placeholder" v-else>
                                <Icon name="mdi:play-circle-outline" />
                                <span>School of Mission</span>
                            </div>
                        </div>
                    </div>

                    <!-- Charity & Empowerment -->
                    <div class="lceci-sub reverse">
                        <div class="lceci-sub-text">
                            <h3>
                                <Icon name="mdi:hand-heart" class="sub-icon" /> Charity &amp; Empowerment
                            </h3>
                            <p>One of our visions is to see believers not only excel in the area of the spirit, but to
                                also live up to their full potentials and fulfill purpose no matter where they find
                                themselves. Light City has awarded various scholarships to those who need them, to help
                                them attain the highest level of education.</p>
                            <p>We also equip eligible persons with necessary skills to set them up for better
                                opportunities. Charity exercises are carried out during our mission outreaches and free
                                medical services are provided for people who may not have the resources to seek medical
                                attention where required.</p>
                        </div>
                        <div class="lceci-sub-video">
                            <div class="video-embed-wrap" v-if="getEmbedUrl(introVideos[5])">
                                <iframe :src="getEmbedUrl(introVideos[5])" title="Charity and Empowerment"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen class="video-iframe"></iframe>
                            </div>
                            <div class="video-placeholder" v-else>
                                <Icon name="mdi:play-circle-outline" />
                                <span>Charity &amp; Empowerment</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- Mission & Vision -->
        <section class="mv-section">
            <div class="container">
                <div class="mv-grid">
                    <div class="mv-card mission">
                        <div class="mv-icon">
                            <Icon name="mdi:target" />
                        </div>
                        <h3>Our Mission</h3>
                        <p>To reach the unreached in rural and forgotten areas through evangelical and missionary
                            outreaches, while raising and discipling leaders through our School of Mission to carry the
                            vision of the Gospel to the ends of the earth.</p>
                    </div>
                    <div class="mv-card vision">
                        <div class="mv-icon">
                            <Icon name="mdi:eye-outline" />
                        </div>
                        <h3>Our Vision</h3>
                        <p>To foster oneness and godliness within the Body of Christ globally, established through
                            prophetic intercession and strategic partnerships that build worship centers and advance
                            Kingdom works across all denominations.</p>
                    </div>
                    <div class="mv-card values">
                        <div class="mv-icon">
                            <Icon name="mdi:heart-outline" />
                        </div>
                        <h3>Our Values</h3>
                        <p>We are committed to compassion and empowerment, manifesting the love of Christ through
                            charity, scholarship schemes, medical outreaches, and dedicated support for widows and the
                            underserved in our communities.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Our Story -->
        <section class="story-section">
            <div class="container">
                <div class="story-grid">
                    <div class="story-img">
                        <img src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&h=450&fit=crop"
                            alt="Our Story" />
                    </div>
                    <div class="story-text">
                        <span class="section-label">LIGHT CITY AND ME</span>
                        <h2>How It All Began</h2>
                        <p>What is known today as light city evangelical centre international ministry (LCECI) was
                            spread headed by its founder / vision bearer Evang. Emmanuel Onyekachi Nkpume, after an
                            encounter with the Lord at a very young age.
                        </p>
                        <p>The story of the encounter that started it all goes as follows</p>
                        <p>On the 27th day of December 1998, at about 1:00am in Idu, Abuja in the Northern part of
                            Nigeria, an angel appeared to young Onyekachi, saying that it was time to start preaching
                            the gospel. He immediately went out in the the middle of the night and began to preach at
                            the top of his voice. After preaching for a while, he joined a Pentecostal church having its
                            fellowship at that time and they prayed for him.
                        </p>
                        <p>As a young Catholic boy, he joined the catholic charismatic renewal of Nigeria ( CCRN) and
                            served in the discipleship arm of its evangelical ministry.
                        </p>
                        <p>In 2006, he moved to the eastern part of Nigeria for his tertiary education and in 2008,
                            still barely a student, a passion for the salvation of the lost souls, he began preaching
                            and teaching the gospel of salvation, also conducted deliverance sessions for those
                            oppressed by the devil. As a result, God began to draw like minded passionate students to
                            him for discipleship, training and evangelism outreaches. The word of God was working
                            mightily in their midst leading to a slogan " ONAWORK" that is "THE WORD WORKS".
                        </p>
                        <p>In 2010, during his NYSC programme at Ekiti State, while fasting and waiting on the Lord, he
                            received the strategy and purpose for his ministry, which are
                        </p>
                        <ul class="pb-4 list-disc ml-4">
                            <li>Rural area evangelism/mission outreach</li>
                            <li>Indoor prayer meetings for discipleship and training missionaries</li>
                            <li>The sponsorship/partnership plan</li>
                            <li>The works of charity to be done in the mission field.</li>
                        </ul>
                        <p> This strategy and purpose were reconfirmed in 2011 at an indoor prayer meeting at Amokwe udi
                            Enugu State
                        </p>
                        <p>In 2012, after the indoor at Ekeani Nkwo, the first mission outreach was held at Juoke
                            Ishienu LGA of Ebonyi state, with 7 missionaries ( 6 male and 1 female) in attendance. The
                            Lord was glorified despite the heavy downpour and bad road. It was characterised with
                            impartation of the spirit and the release of power.
                        </p>
                        <p>The rest is history as the Lord has been doing mighty and awesome things through the
                            instrument of light city evangelical centre international in Various states and communities
                            in the nation and beyond. We bless the name of the Lord in Jesus name. Amen</p>
                        <div class="story-stats">
                            <div class="ss">
                                <strong>10+</strong><span>Years</span>
                            </div>
                            <div class="ss">
                                <strong>500+</strong><span>Members</span>
                            </div>
                            <div class="ss">
                                <strong>3</strong><span>Locations</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Leadership
        <section class="leadership-section">
            <div class="container">
                <h2 class="section-title">Our Leadership</h2>
                <div class="leaders-grid">
                    <div class="leader-card" v-for="leader in leaders" :key="leader.name">
                        <div class="leader-img">
                            <img :src="leader.img" :alt="leader.name" />
                        </div>
                        <h4>{{ leader.name }}</h4>
                        <p>{{ leader.role }}</p>
                    </div>
                </div>
            </div>
        </section> -->

        <AppFooter />
    </div>
</template>

<script setup lang="ts">
import { useAppResourceInfoStore } from '~/stores/appResourceInfo';
import type { VideoListResponse } from '~/types/api';
import type { VideoLink } from '~/types/models';

useHead({
    title: 'About Us | Light City Evangelical Center',
    meta: [
        {
            name: 'description',
            content: 'Learn about Light City Evangelical Center Int\'l — our mission to reach the unreached, our vision for the Body of Christ, and our story since 2014.',
        },
    ],
});

const { get } = useApi();
const store = useAppResourceInfoStore();

const INTRO_VIDEO_COUNT = 6;
const fetchedVideos = ref<VideoLink[]>([]);

const getYouTubeId = (video: VideoLink): string | null => {
    if (video.video_id && video.video_id.length === 11) return video.video_id;
    const match = video.url?.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return match ? match[1]! : null;
};

const getEmbedUrl = (video: VideoLink | undefined): string | null => {
    if (!video) return null;
    const id = getYouTubeId(video);
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
};

// Build a list of exactly INTRO_VIDEO_COUNT videos, repeating if needed
const introVideos = computed<VideoLink[]>(() => {
    const source = fetchedVideos.value.length > 0 ? fetchedVideos.value : store.videos;
    if (source.length === 0) return [];
    return Array.from({ length: INTRO_VIDEO_COUNT }, (_, i) => source[i % source.length]!);
});

onMounted(async () => {
    // Use store videos if already loaded
    if (store.videos.length > 0) {
        fetchedVideos.value = store.videos;
        return;
    }
    try {
        const response = await get<VideoListResponse>('/videos', { per_page: 6 });
        const videos = response.data?.data ?? [];
        fetchedVideos.value = videos;
        if (store.videos.length === 0) store.videos = videos;
    } catch (e) {
        console.error('Failed to load intro videos:', e);
    }
});

const leaders = [
    { name: 'Pastor John Adeyemi', role: 'Senior Pastor', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&facepad=2&faces=1' },
    { name: 'Pastor Sarah Adeyemi', role: 'Co-Pastor & Women\'s Lead', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop' },
    { name: 'Bro James Mensah', role: 'Director of Worship', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop' },
    { name: 'Sis Grace Okafor', role: 'Children\'s Ministry Lead', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop' },
];
</script>

<style scoped>
.page-wrapper {
    font-family: 'Segoe UI', system-ui, sans-serif;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

.section-title {
    font-size: 2rem;
    font-weight: 800;
    color: var(--lc-dark);
    text-align: center;
    margin-bottom: 2.5rem;
}

.section-label {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--lc-gold);
}

/* Page Hero */
.page-hero {
    position: relative;
    height: 340px;
    display: flex;
    align-items: center;
    overflow: hidden;
}

.ph-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}

.ph-overlay {
    position: absolute;
    inset: 0;
    background: rgba(15, 10, 40, 0.72);
    z-index: 1;
}

.ph-content {
    position: relative;
    z-index: 2;
    padding: 0 10%;
}

.ph-label {
    color: var(--lc-gold);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
}

.ph-content h1 {
    font-size: 2.8rem;
    font-weight: 900;
    color: #fff;
    margin: 0 0 0.5rem;
}

.ph-sub {
    color: rgba(255, 255, 255, 0.75);
    font-size: 1rem;
    margin: 0;
}

/* Mission / Vision */
.mv-section {
    padding: 5rem 0;
    background: #f9f9fb;
}

.mv-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.75rem;
}

.mv-card {
    background: #fff;
    border-radius: 12px;
    padding: 2.25rem;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
    border-top: 4px solid var(--lc-gold);
    transition: transform 0.25s;
}

.mv-card:hover {
    transform: translateY(-4px);
}

.mv-icon {
    font-size: 2rem;
    color: var(--lc-gold);
    margin-bottom: 1rem;
}

.mv-card h3 {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--lc-dark);
    margin-bottom: 0.75rem;
}

.mv-card p {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.7;
    margin: 0;
}

/* Story */
.story-section {
    padding: 5rem 0;
    background: #fff;
}

.story-grid {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 4rem;
    align-items: center;
}

.story-img img {
    width: 100%;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.story-text h2 {
    font-size: 2rem;
    font-weight: 800;
    color: var(--lc-dark);
    margin: 0.5rem 0 1.25rem;
}

.story-text p {
    color: #666;
    line-height: 1.8;
    font-size: 0.95rem;
    margin-bottom: 1rem;
}

.story-stats {
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #eee;
}

.ss {
    text-align: center;
}

.ss strong {
    display: block;
    font-size: 2rem;
    font-weight: 900;
    color: var(--lc-gold);
}

.ss span {
    font-size: 0.8rem;
    color: #999;
    font-weight: 600;
    text-transform: uppercase;
}

/* Leadership */
.leadership-section {
    padding: 5rem 0;
    background: var(--lc-dark);
}

.leadership-section .section-title {
    color: #fff;
}

.leaders-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
}

.leader-card {
    text-align: center;
}

.leader-img {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto 1rem;
    border: 3px solid var(--lc-gold);
}

.leader-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.leader-card h4 {
    color: #fff;
    font-weight: 700;
    margin-bottom: 0.25rem;
    font-size: 0.95rem;
}

.leader-card p {
    color: var(--lc-gold);
    font-size: 0.8rem;
    margin: 0;
}

@media (max-width: 900px) {
    .mv-grid {
        grid-template-columns: 1fr;
    }

    .story-grid {
        grid-template-columns: 1fr;
    }

    .leaders-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 560px) {
    .leaders-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* LCECI Introduction Section */
.lceci-section {
    padding: 5rem 0;
    background: #fff;
}

.lceci-header {
    text-align: center;
    max-width: 820px;
    margin: 0 auto 3rem;
}

.lceci-header h2 {
    font-size: 2rem;
    font-weight: 900;
    color: var(--lc-dark);
    margin: 0.5rem 0 1.25rem;
    line-height: 1.2;
}

.lceci-intro {
    color: #555;
    font-size: 1rem;
    line-height: 1.8;
    margin: 0;
}

.lceci-who {
    max-width: 820px;
    margin: 0 auto 3.5rem;
    padding: 1.75rem 2rem;
    background: #f9f9fb;
    border-left: 4px solid var(--lc-gold);
    border-radius: 0 8px 8px 0;
}

.lceci-who p {
    color: #555;
    font-size: 0.95rem;
    line-height: 1.8;
    margin: 0;
}

.lceci-subsections {
    display: flex;
    flex-direction: column;
    gap: 6rem;
}

.lceci-sub {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 3rem;
    align-items: center;
}

.lceci-sub.reverse {
    grid-template-columns: 1fr 1.1fr;
}

.lceci-sub.reverse .lceci-sub-text {
    order: 2;
}

.lceci-sub.reverse .lceci-sub-video {
    order: 1;
}

.lceci-sub-text h3 {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--lc-dark);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.sub-icon {
    color: var(--lc-gold);
    font-size: 1.4rem;
    flex-shrink: 0;
}

.lceci-sub-text p {
    color: #666;
    font-size: 0.92rem;
    line-height: 1.8;
    margin-bottom: 0.75rem;
}

.lceci-sub-text p:last-child {
    margin-bottom: 0;
}

.lceci-sub-video .video-embed-wrap {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    aspect-ratio: 16/9;
    background: #000;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.14);
}

.lceci-sub-video .video-iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
    display: block;
}

.video-placeholder {
    aspect-ratio: 16/9;
    border-radius: 10px;
    background: var(--lc-dark);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    font-size: 3rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.14);
}

.video-placeholder span {
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

@media (max-width: 900px) {

    .lceci-sub,
    .lceci-sub.reverse {
        grid-template-columns: 1fr;
        gap: 1.75rem;
    }

    .lceci-sub.reverse .lceci-sub-text {
        order: 1;
    }

    .lceci-sub.reverse .lceci-sub-video {
        order: 2;
    }
}
</style>
