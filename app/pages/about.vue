<template>
    <div class="font-[Segoe_UI,system-ui,sans-serif]">
        <NavBar />

        <!-- Page Hero -->
        <section class="relative h-[340px] flex items-center overflow-hidden">
            <div class="absolute inset-0 z-[1]" style="background: rgba(15,10,40,0.72);"></div>
            <img src="https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1920&h=400&fit=crop" alt="About Us"
                class="absolute inset-0 w-full h-full object-cover z-0" />
            <div class="relative z-[2] px-[10%]">
                <p class="section-label mb-2">Who We Are</p>
                <h1 class="text-[2.8rem] font-black text-white m-0 mb-2">About Light City</h1>
                <p class="text-white/75 text-base m-0">A community of believers committed to loving God and making
                    disciples.</p>
            </div>
        </section>

        <!-- LCECI Introduction -->
        <section class="py-20 bg-white">
            <div class="max-w-[1200px] mx-auto px-6">
                <div class="text-center max-w-[820px] mx-auto mb-12">
                    <span class="section-label">Introduction</span>
                    <h2 class="text-[2rem] font-black mt-2 mb-5 leading-tight" style="color: var(--lc-dark);">Light City
                        Evangelical Center International</h2>
                    <p class="text-[#555] text-base leading-[1.8] m-0">Light City Evangelical Center (LCECI) is a
                        non-denominational Christian
                        Ministry — a part of the body of Christ striving to contribute its best to properly and
                        accurately build up the saints, and edify the Church of Jesus Christ for the work of ministry
                        in the present day Church. We are a team of visionary Christians from different denominations,
                        with a passion to reach the unreached with the true gospel of our Lord Jesus Christ, to save
                        souls and win the lost back to the kingdom of God. Our message is the pure gospel of
                        redemption, salvation, righteousness and sanctification.</p>
                </div>

                <!-- Who We Are -->
                <div class="max-w-[820px] mx-auto mb-14 px-8 py-7 bg-[#f9f9fb] rounded-r-lg"
                    style="border-left: 4px solid var(--lc-gold);">
                    <p class="text-[#555] text-[0.95rem] leading-[1.8] m-0">Our purpose and goal is to raise visionary,
                        purpose-driven Christians, full of the Holy Spirit
                        and manifesting the power and gifts of the Spirit in various dimensions. Light City Evangelical
                        Center is strongly rooted in the ministry of the Word, which gave rise to its slogan:
                        <em>"The Word of God Works."</em> We are strongly confident in the efficacy of the Word of God
                        and the Ministry of the blood of Jesus Christ which has atoned for everyone who believes.
                    </p>
                </div>

                <!-- Single video covering all subsections -->
                <div class="max-w-[900px] mx-auto mb-16">
                    <div class="video-embed-wrap">
                        <iframe src="https://www.youtube.com/embed/Q3JXQkaJnQE?rel=0&modestbranding=1"
                            title="Light City Evangelical Center International" frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen class="video-iframe"></iframe>
                    </div>
                </div>

                <!-- Subsections (full-width) -->
                <div class="flex flex-col gap-12">

                    <!-- Reaching the unreached -->
                    <div class="lceci-sub-full">
                        <h3 class="text-[1.25rem] font-extrabold mb-4 flex items-center gap-2"
                            style="color: var(--lc-dark);">
                            <Icon name="mdi:road" class="sub-icon" /> Reaching the unreached
                        </h3>
                        <p class="text-[#666] text-[0.92rem] leading-[1.8] mb-3">Reaching the unreached with the
                            gospel of our Lord Jesus Christ, especially in rural and
                            forgotten areas where the gospel is scarce. The first and most important goal of Light
                            City is to spread the true and unadulterated gospel of Jesus Christ to the ends of the
                            earth.</p>
                        <p class="text-[#666] text-[0.92rem] leading-[1.8]">We seek out remote villages and areas
                            that are neglected and forgotten, to bring them
                            the gospel that is able to save them and bring them out of darkness into the marvelous
                            light of God. Light City also conducts evangelism outreaches in urban areas, schools,
                            institutions, and every place where souls may be found.</p>
                    </div>

                    <!-- Discipleship -->
                    <div class="lceci-sub-full">
                        <h3 class="text-[1.25rem] font-extrabold mb-4 flex items-center gap-2"
                            style="color: var(--lc-dark);">
                            <Icon name="mdi:account-group" class="sub-icon" /> Discipleship
                        </h3>
                        <p class="text-[#666] text-[0.92rem] leading-[1.8] mb-3">We raise leaders and missionaries
                            who will carry the vision of the ministry to the ends
                            of the earth. Light City does not only preach and leave new converts to their fate —
                            rather we put them through a period of discipleship, raising them from mere babes in
                            the kingdom into leaders and purpose-driven missionaries.</p>
                        <p class="text-[#666] text-[0.92rem] leading-[1.8]">Wherever Light City disciples find
                            themselves, they become like the early Christians who
                            went about doing exploits and spreading the message of Christ. Light City raises men
                            who will go to their vicinity, their churches and communities to depopulate the kingdom
                            of darkness.</p>
                    </div>

                    <!-- Manifestation of the Kingdom -->
                    <div class="lceci-sub-full">
                        <h3 class="text-[1.25rem] font-extrabold mb-4 flex items-center gap-2"
                            style="color: var(--lc-dark);">
                            <Icon name="mdi:fire" class="sub-icon" /> Manifestation of the Kingdom
                        </h3>
                        <p class="text-[#666] text-[0.92rem] leading-[1.8] mb-3">Through its various programs and
                            outreaches, Light City has brought diverse healings
                            from all kinds of diseases, deliverance from bondage and captivity of the evil one,
                            breaking of yokes of poverty, freedom from demonic oppressions, and family and
                            community liberations to numerous people.</p>
                        <p class="text-[#666] text-[0.92rem] leading-[1.8]">Our strong faith and dependence on the
                            Word of God and the manifestation of the power
                            of the Holy Spirit has made Light City a driving force in bringing freedom to the
                            oppressed. We have recorded diverse testimonies of spiritual freedoms, various kinds of
                            healing and financial prosperities.</p>
                    </div>

                    <!-- Prophetic Intercession -->
                    <div class="lceci-sub-full">
                        <h3 class="text-[1.25rem] font-extrabold mb-4 flex items-center gap-2"
                            style="color: var(--lc-dark);">
                            <Icon name="mdi:hands-pray" class="sub-icon" /> Raising Prophetic Intercessors
                        </h3>
                        <p class="text-[#666] text-[0.92rem] leading-[1.8] mb-3">Light City believes in the words of
                            Jesus in Luke 18:1 — "men ought to pray and not
                            faint" — and so we have systematically raised prophetic intercessors who stand in the
                            gap and bring down the government of God upon the earth in the place of prayer.</p>
                        <p class="text-[#666] text-[0.92rem] leading-[1.8]">Our aim is to tarry in the secret place
                            until the Word of God comes to pass in the
                            lives of men and in the world at large. We never embark on any mission outreach or
                            program without intensive prayer sessions to bring down strongholds that may oppose the
                            mandate from being fulfilled.</p>
                    </div>

                    <!-- School of Mission -->
                    <div class="lceci-sub-full">
                        <h3 class="text-[1.25rem] font-extrabold mb-4 flex items-center gap-2"
                            style="color: var(--lc-dark);">
                            <Icon name="mdi:school" class="sub-icon" /> School of Mission and Evangelism
                        </h3>
                        <p class="text-[#666] text-[0.92rem] leading-[1.8] mb-3">Light City runs a school of mission
                            and evangelism where eligible people who are willing
                            and ready to dedicate their time to fulfilling the mission mandate are trained — from
                            the foundations of faith to the deeper bible-based principles of the Christian life
                            that guide a worker in God's vineyard.</p>
                        <p class="text-[#666] text-[0.92rem] leading-[1.8]">This school system qualifies its
                            participants to partake in our mission outreaches,
                            regardless of their denomination. We partner with every bible-believing church or
                            ministry that shares the desire to see the heartbeat of God fulfilled.</p>
                    </div>

                    <!-- Charity & Empowerment -->
                    <div class="lceci-sub-full">
                        <h3 class="text-[1.25rem] font-extrabold mb-4 flex items-center gap-2"
                            style="color: var(--lc-dark);">
                            <Icon name="mdi:hand-heart" class="sub-icon" /> Charity &amp; Empowerment
                        </h3>
                        <p class="text-[#666] text-[0.92rem] leading-[1.8] mb-3">One of our visions is to see
                            believers not only excel in the area of the spirit, but to
                            also live up to their full potentials and fulfill purpose no matter where they find
                            themselves. Light City has awarded various scholarships to those who need them, to help
                            them attain the highest level of education.</p>
                        <p class="text-[#666] text-[0.92rem] leading-[1.8]">We also equip eligible persons with
                            necessary skills to set them up for better
                            opportunities. Charity exercises are carried out during our mission outreaches and free
                            medical services are provided for people who may not have the resources to seek medical
                            attention where required.</p>
                    </div>

                </div>
            </div>
        </section>

        <!-- Mission & Vision -->
        <section class="py-20 bg-[#f9f9fb]">
            <div class="max-w-[1200px] mx-auto px-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-7">
                    <div class="bg-white rounded-xl p-9 shadow-[0_2px_16px_rgba(0,0,0,0.06)] mv-card transition-transform duration-[250ms] hover:-translate-y-1"
                        style="border-top: 4px solid var(--lc-gold);">
                        <div class="text-[2rem] mb-4" style="color: var(--lc-gold);">
                            <Icon name="mdi:target" />
                        </div>
                        <h3 class="text-[1.1rem] font-extrabold mb-3" style="color: var(--lc-dark);">Our Mission</h3>
                        <p class="text-[#666] text-[0.9rem] leading-[1.7] m-0">To reach the unreached in rural and
                            forgotten areas through evangelical and missionary
                            outreaches, while raising and discipling leaders through our School of Mission to carry the
                            vision of the Gospel to the ends of the earth.</p>
                    </div>
                    <div class="bg-white rounded-xl p-9 shadow-[0_2px_16px_rgba(0,0,0,0.06)] mv-card transition-transform duration-[250ms] hover:-translate-y-1"
                        style="border-top: 4px solid var(--lc-gold);">
                        <div class="text-[2rem] mb-4" style="color: var(--lc-gold);">
                            <Icon name="mdi:eye-outline" />
                        </div>
                        <h3 class="text-[1.1rem] font-extrabold mb-3" style="color: var(--lc-dark);">Our Vision</h3>
                        <p class="text-[#666] text-[0.9rem] leading-[1.7] m-0">To foster oneness and godliness within
                            the Body of Christ globally, established through
                            prophetic intercession and strategic partnerships that build worship centers and advance
                            Kingdom works across all denominations.</p>
                    </div>
                    <div class="bg-white rounded-xl p-9 shadow-[0_2px_16px_rgba(0,0,0,0.06)] mv-card transition-transform duration-[250ms] hover:-translate-y-1"
                        style="border-top: 4px solid var(--lc-gold);">
                        <div class="text-[2rem] mb-4" style="color: var(--lc-gold);">
                            <Icon name="mdi:heart-outline" />
                        </div>
                        <h3 class="text-[1.1rem] font-extrabold mb-3" style="color: var(--lc-dark);">Our Values</h3>
                        <p class="text-[#666] text-[0.9rem] leading-[1.7] m-0">We are committed to compassion and
                            empowerment, manifesting the love of Christ through
                            charity, scholarship schemes, medical outreaches, and dedicated support for widows and the
                            underserved in our communities.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Our Story -->
        <section class="py-20 bg-white">
            <div class="max-w-[1200px] mx-auto px-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-top">
                    <div>
                        <img src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&h=450&fit=crop"
                            alt="Our Story" class="w-full rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]" />
                    </div>
                    <div>
                        <span class="section-label">LIGHT CITY AND ME</span>
                        <h2 class="text-[2rem] font-extrabold mt-2 mb-5" style="color: var(--lc-dark);">How It All Began
                        </h2>
                        <p class="text-[#666] leading-[1.8] text-[0.95rem] mb-4">What is known today as light city
                            evangelical centre international ministry (LCECI) was
                            spread headed by its founder / vision bearer Evang. Emmanuel Onyekachi Nkpume, after an
                            encounter with the Lord at a very young age.
                        </p>
                        <p class="text-[#666] leading-[1.8] text-[0.95rem] mb-4">The story of the encounter that started
                            it all goes as follows</p>
                        <p class="text-[#666] leading-[1.8] text-[0.95rem] mb-4">On the 27th day of December 1998, at
                            about 1:00am in Idu, Abuja in the Northern part of
                            Nigeria, an angel appeared to young Onyekachi, saying that it was time to start preaching
                            the gospel. He immediately went out in the the middle of the night and began to preach at
                            the top of his voice. After preaching for a while, he joined a Pentecostal church having its
                            fellowship at that time and they prayed for him.
                        </p>
                        <p class="text-[#666] leading-[1.8] text-[0.95rem] mb-4">As a young Catholic boy, he joined the
                            catholic charismatic renewal of Nigeria ( CCRN) and
                            served in the discipleship arm of its evangelical ministry.
                        </p>
                        <p class="text-[#666] leading-[1.8] text-[0.95rem] mb-4">In 2006, he moved to the eastern part
                            of Nigeria for his tertiary education and in 2008,
                            still barely a student, a passion for the salvation of the lost souls, he began preaching
                            and teaching the gospel of salvation, also conducted deliverance sessions for those
                            oppressed by the devil. As a result, God began to draw like minded passionate students to
                            him for discipleship, training and evangelism outreaches. The word of God was working
                            mightily in their midst leading to a slogan " ONAWORK" that is "THE WORD WORKS".
                        </p>
                        <p class="text-[#666] leading-[1.8] text-[0.95rem] mb-4">In 2010, during his NYSC programme at
                            Ekiti State, while fasting and waiting on the Lord, he
                            received the strategy and purpose for his ministry, which are
                        </p>
                        <ul class="pb-4 list-disc ml-4">
                            <li>Rural area evangelism/mission outreach</li>
                            <li>Indoor prayer meetings for discipleship and training missionaries</li>
                            <li>The sponsorship/partnership plan</li>
                            <li>The works of charity to be done in the mission field.</li>
                        </ul>
                        <p class="text-[#666] leading-[1.8] text-[0.95rem] mb-4"> This strategy and purpose were
                            reconfirmed in 2011 at an indoor prayer meeting at Amokwe udi
                            Enugu State
                        </p>
                        <p class="text-[#666] leading-[1.8] text-[0.95rem] mb-4">In 2012, after the indoor at Ekeani
                            Nkwo, the first mission outreach was held at Juoke
                            Ishienu LGA of Ebonyi state, with 7 missionaries ( 6 male and 1 female) in attendance. The
                            Lord was glorified despite the heavy downpour and bad road. It was characterised with
                            impartation of the spirit and the release of power.
                        </p>
                        <p class="text-[#666] leading-[1.8] text-[0.95rem] mb-4">The rest is history as the Lord has
                            been doing mighty and awesome things through the
                            instrument of light city evangelical centre international in Various states and communities
                            in the nation and beyond. We bless the name of the Lord in Jesus name. Amen</p>
                        <div class="flex gap-8 mt-8 pt-8 border-t border-[#eee]">
                            <div class="text-center">
                                <strong class="block text-[2rem] font-black" style="color: var(--lc-gold);">10+</strong>
                                <span class="text-[0.8rem] text-[#999] font-semibold uppercase">Years</span>
                            </div>
                            <div class="text-center">
                                <strong class="block text-[2rem] font-black"
                                    style="color: var(--lc-gold);">500+</strong>
                                <span class="text-[0.8rem] text-[#999] font-semibold uppercase">Members</span>
                            </div>
                            <div class="text-center">
                                <strong class="block text-[2rem] font-black" style="color: var(--lc-gold);">3</strong>
                                <span class="text-[0.8rem] text-[#999] font-semibold uppercase">Locations</span>
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
useHead({
    title: 'About Us | Light City Evangelical Center',
    meta: [
        {
            name: 'description',
            content: 'Learn about Light City Evangelical Center Int\'l — our mission to reach the unreached, our vision for the Body of Christ, and our story since 2014.',
        },
    ],
});

const leaders = [
    { name: 'Pastor John Adeyemi', role: 'Senior Pastor', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&facepad=2&faces=1' },
    { name: 'Pastor Sarah Adeyemi', role: 'Co-Pastor & Women\'s Lead', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop' },
    { name: 'Bro James Mensah', role: 'Director of Worship', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop' },
    { name: 'Sis Grace Okafor', role: 'Children\'s Ministry Lead', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop' },
];
</script>

<style scoped>
/* section-label uses CSS variable — kept here for --lc-gold reference */
.section-label {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--lc-gold);
}

/* sub-icon uses CSS variable */
.sub-icon {
    color: var(--lc-gold);
    font-size: 1.4rem;
    flex-shrink: 0;
}

/* Full-width subsection */
.lceci-sub-full {
    max-width: 820px;
    margin: 0 auto;
}

/* Video embed — aspect-ratio shorthand and absolute-fill iframe pattern */
.video-embed-wrap {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    aspect-ratio: 16/9;
    background: #000;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.14);
}

.video-iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
    display: block;
}

/* video-placeholder uses --lc-dark CSS variable */
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
</style>
