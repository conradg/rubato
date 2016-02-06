! function() {
    var e = Package.meteor.Meteor,
        t = Package.underscore._,
        o = Package.tracker.Tracker,
        i = Package.tracker.Deps,
        a = Package.blaze.Blaze,
        n = Package.blaze.UI,
        s = Package.blaze.Handlebars,
        c = Package.htmljs.HTML,
        r, h, d;
    (function() {
        (function() {
            r = function(e) {
                this.audioCtx = e.audioContext, this.onSuccess = e.onSuccess, this.onReject = e.onReject, this.onNoSource = e.onNoSource, this.onAudioData = e.onAudioData, this.onFlashInit = e.onFlashInit, this.onNoSignal = e.onNoSignal, this.micCheckDuration = 20, this.micCheckCounter = 0, this.audioFrameSum = 0, this.audioResource, this.sourceNode, this.intermediateNode, this.flash = void 0 !== e.flash ? e.flash : !0, this.loaded = !1, this.started = !1, this.start()
            }, t.extend(r.prototype, {
                load: function() {
                    var e = this;
                    e.intermediateNode = e.audioCtx.createScriptProcessor(1024, 1, 1), e.intermediateNode.onaudioprocess = function(t) {
                        var o = t.inputBuffer.getChannelData(0),
                            i = t.outputBuffer.getChannelData(0);
                        e.micCheckCounter < e.micCheckDuration && e.micCheck(o), e.onAudioData && e.onAudioData(o), i.set(o)
                    }, this.loaded = !0
                },
                connect: function(e) {
                    var t = this;
                    try {
                        t.intermediateNode.connect(e)
                    } catch (o) {
                        console.error(o)
                    }
                },
                start: function() {
                    var e = this;
                    if (this.loaded || this.load(), navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia, navigator.getUserMedia) this.audioResource = new d(this.onSuccess, this.onReject, this.audioCtx, this);
                    else try {
                        this.onNoSource()
                    } catch (t) {
                        console.log(t), console.warn("No microphone source was detected, please switch to another browser.")
                    }
                },
                micCheck: function(e) {
                    this.micCheckCounter++;
                    for (var t = e.length - 1; t >= 0; t--) this.audioFrameSum += e[t];
                    if (this.micCheckCounter == this.micCheckDuration && 0 == this.audioFrameSum) try {
                        this.onNoSignal()
                    } catch (o) {
                        console.log(o), console.warn("No signal from microphone detected, check your operating systems audio settings.")
                    }
                },
                stop: function() {
                    console.log("[Microphone] stopping"), this.audioResource.disable()
                }
            })
        }).call(this),
            function() {
                h = function() {
                    this.createSourceNode = function(e) {
                        console.log("not implemented")
                    }, this.load = function() {
                        console.log("not implemented")
                    }, this.start = function() {
                        console.log("not implemented")
                    }, this.stop = function() {
                        console.log("not implemented")
                    }, this.disable = function() {
                        console.log("not implemented")
                    }, this.mute = function() {
                        console.log("not implemented")
                    }, this.unmute = function() {
                        console.log("not implemented")
                    }
                }
            }.call(this),
            function() {
                d = function(e, t, o, i) {
                    var a = this;
                    this.microphone = i, this.audioCtx = o, this.mediaStream, this.load(e, t)
                }, d.prototype = new h, t.extend(d.prototype, {
                    constructor: d,
                    createSourceNode: function(e) {
                        this.mediaStream = e, this.microphone.sourceNode = this.audioCtx.createMediaStreamSource(this.mediaStream), this.microphone.sourceNode.connect(this.microphone.intermediateNode)
                    },
                    load: function(e, t) {
                        var o = this;
                        try {
                            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
                        } catch (i) {
                            console.error("getUserMedia is not supported in this browser.")
                        }
                        navigator.getUserMedia({
                            audio: !0
                        }, function(t) {
                            o.createSourceNode(t);
                            try {
                                e(t)
                            } catch (i) {
                                console.log(i)
                            }
                        }, t)
                    },
                    start: function() {
                        console.log("not implemented")
                    },
                    stop: function() {
                        console.log("not implemented")
                    },
                    disable: function() {
                        if (this.mediaStream)
                            if (this.mediaStream.stop) this.mediaStream.stop();
                            else {
                                var e = this.mediaStream.getAudioTracks()[0];
                                e.stop()
                            }
                    },
                    mute: function() {
                        this.mediaStream.getAudioTracks()[0].enabled = !1
                    },
                    unmute: function() {
                        this.mediaStream.getAudioTracks()[0].enabled = !0
                    }
                })
            }.call(this)
    }).call(this), "undefined" == typeof Package && (Package = {}), Package["flowkey:microphone"] = {
        Microphone: r
    }
}();

! function() {
    var t = Package.meteor.Meteor,
        e, s, i, a, h, r, n, l;
    (function() {
        (function() {
            function t(t, e) {
                "function" != typeof this[t] && "object" != typeof this[t] && ("function" == typeof this[e] && "object" != typeof this[e] ? this[t] = this[e] : this[t] = function(t) {
                    return t instanceof Array ? t : "number" == typeof t ? new Array(t) : void 0
                })
            }

            function a(t, e) {
                this.bufferSize = t
                this.sampleRate = e
                this.bandwidth = 2 / t * e / 2
                this.spectrum = new Float32Array(t / 2)
                this.real = new Float32Array(t)
                this.imag = new Float32Array(t)
                this.peakBand = 0
                this.peak = 0
                this.getBandFrequency = function(t) {
                    return this.bandwidth * t + this.bandwidth / 2
                }
                this.calculateSpectrum = function() {
                    for (var e = this.spectrum
                         s = this.real
                         i = this.imag
                         a = 2 / this.bufferSize
                         h = Math.sqrt
                         r
                         n
                         l
                         o = 0
                         u = t / 2; u > o; o++) r = s[o], n = i[o], l = a * h(r * r + n * n), l > this.peak && (this.peakBand = o, this.peak = l), e[o] = l
                }
            }

            function h(t, e) {
                a.call(this, t, e);
                var s = t / 2 * t,
                    i = 2 * Math.PI;
                this.sinTable = new Float32Array(s), this.cosTable = new Float32Array(s);
                for (var h = 0; s > h; h++) this.sinTable[h] = Math.sin(h * i / t), this.cosTable[h] = Math.cos(h * i / t)
            }

            function r(t, e) {
                a.call(this, t, e), this.trans = new Float32Array(t), this.reverseTable = new Uint32Array(t), this.reverseBinPermute = function(t, e) {
                    var s = this.bufferSize,
                        i = s >>> 1,
                        a = s - 1,
                        h = 1,
                        r = 0,
                        n;
                    t[0] = e[0];
                    do {
                        for (r += i, t[h] = e[r], t[r] = e[h], h++, n = i << 1; n >>= 1, !((r ^= n) & n););
                        r >= h && (t[h] = e[r], t[r] = e[h], t[a - h] = e[a - r], t[a - r] = e[a - h]), h++
                    } while (i > h);
                    t[a] = e[a]
                }, this.generateReverseTable = function() {
                    var t = this.bufferSize,
                        e = t >>> 1,
                        s = t - 1,
                        i = 1,
                        a = 0,
                        h;
                    this.reverseTable[0] = 0;
                    do {
                        for (a += e, this.reverseTable[i] = a, this.reverseTable[a] = i, i++, h = e << 1; h >>= 1, !((a ^= h) & h););
                        a >= i && (this.reverseTable[i] = a, this.reverseTable[a] = i, this.reverseTable[s - i] = s - a, this.reverseTable[s - a] = s - i), i++
                    } while (e > i);
                    this.reverseTable[s] = s
                }, this.generateReverseTable()
            }

            function n(t, s, i, a, h, r, n, l) {
                this.file = t, this.bufferSize = s, this.sampleRate = i, this.playStart = a || 0, this.playEnd = h || 1, this.loopStart = r || 0, this.loopEnd = n || 1, this.loopMode = l || e.OFF, this.loaded = !1, this.samples = [], this.signal = new Float32Array(s), this.frameCount = 0, this.envelope = null, this.amplitude = 1, this.rootFrequency = 110, this.frequency = 550, this.step = this.frequency / this.rootFrequency, this.duration = 0, this.samplesProcessed = 0, this.playhead = 0;
                var o = document.createElement("AUDIO"),
                    u = this;
                this.loadSamples = function(t) {
                    for (var s = e.getChannel(e.MIX, t.frameBuffer), i = 0; i < s.length; i++) u.samples.push(s[i])
                }, this.loadComplete = function() {
                    u.samples = new Float32Array(u.samples), u.loaded = !0
                }, this.loadMetaData = function() {
                    u.duration = o.duration
                }, o.addEventListener("MozAudioAvailable", this.loadSamples, !1), o.addEventListener("loadedmetadata", this.loadMetaData, !1), o.addEventListener("ended", this.loadComplete, !1), o.muted = !0, o.src = t, o.play()
            }

            function l(t, s, i, a, h) {
                switch (this.frequency = s, this.amplitude = i, this.bufferSize = a, this.sampleRate = h, this.frameCount = 0, this.waveTableLength = 2048, this.cyclesPerSample = s / h, this.signal = new Float32Array(a), this.envelope = null, parseInt(t, 10)) {
                    case e.TRIANGLE:
                        this.func = l.Triangle;
                        break;
                    case e.SAW:
                        this.func = l.Saw;
                        break;
                    case e.SQUARE:
                        this.func = l.Square;
                        break;
                    default:
                    case e.SINE:
                        this.func = l.Sine
                }
                this.generateWaveTable = function() {
                    l.waveTable[this.func] = new Float32Array(2048);
                    for (var t = this.waveTableLength / this.sampleRate, e = 1 / t, s = 0; s < this.waveTableLength; s++) l.waveTable[this.func][s] = this.func(s * e / this.sampleRate)
                }, "undefined" == typeof l.waveTable && (l.waveTable = {}), "undefined" == typeof l.waveTable[this.func] && this.generateWaveTable(), this.waveTable = l.waveTable[this.func]
            }

            function o(t, e, s, i, a, h) {
                this.sampleRate = h, this.attackLength = t, this.decayLength = e, this.sustainLevel = s, this.sustainLength = i, this.releaseLength = a, this.sampleRate = h, this.attackSamples = t * h, this.decaySamples = e * h, this.sustainSamples = i * h, this.releaseSamples = a * h, this.update = function() {
                    this.attack = this.attackSamples, this.decay = this.attack + this.decaySamples, this.sustain = this.decay + this.sustainSamples, this.release = this.sustain + this.releaseSamples
                }, this.update(), this.samplesProcessed = 0
            }

            function u(t, s, i, a) {
                switch (this.sampleRate = a, t) {
                    case e.LOWPASS:
                    case e.LP12:
                        this.func = new u.LP12(s, i, a)
                }
            }

            function f(t, e, s, i) {
                this.type = t
                this.cutoff = e
                this.resonance = s
                this.sampleRate = i
                this.f = Float32Array(4)
                this.f[0] = 0
                this.f[1] = 0
                this.f[2] = 0
                this.f[3] = 0
                this.calcCoeff = function(t, e) {
                    this.freq = 2 * Math.sin(Math.PI * Math.min(.25, t / (2 * this.sampleRate))), this.damp = Math.min(2 * (1 - Math.pow(e, .25)), Math.min(2, 2 / this.freq - .5 * this.freq))
                }, this.calcCoeff(e, s)
            }

            function c(t) {
                return (Math.exp(t) - Math.exp(-t)) / 2
            }

            function p(t, s) {
                this.Fs = s, this.type = t, this.parameterType = e.Q, this.x_1_l = 0, this.x_2_l = 0, this.y_1_l = 0, this.y_2_l = 0, this.x_1_r = 0, this.x_2_r = 0, this.y_1_r = 0, this.y_2_r = 0, this.b0 = 1, this.a0 = 1, this.b1 = 0, this.a1 = 0, this.b2 = 0, this.a2 = 0, this.b0a0 = this.b0 / this.a0, this.b1a0 = this.b1 / this.a0, this.b2a0 = this.b2 / this.a0, this.a1a0 = this.a1 / this.a0, this.a2a0 = this.a2 / this.a0, this.f0 = 3e3, this.dBgain = 12, this.Q = 1, this.BW = -3, this.S = 1, this.coefficients = function() {
                    var t = [this.b0, this.b1, this.b2],
                        e = [this.a0, this.a1, this.a2];
                    return {
                        b: t,
                        a: e
                    }
                }, this.setFilterType = function(t) {
                    this.type = t, this.recalculateCoefficients()
                }, this.setSampleRate = function(t) {
                    this.Fs = t, this.recalculateCoefficients()
                }, this.setQ = function(t) {
                    this.parameterType = e.Q, this.Q = Math.max(Math.min(t, 115), .001), this.recalculateCoefficients()
                }, this.setBW = function(t) {
                    this.parameterType = e.BW, this.BW = t, this.recalculateCoefficients()
                }, this.setS = function(t) {
                    this.parameterType = e.S, this.S = Math.max(Math.min(t, 5), 1e-4), this.recalculateCoefficients()
                }, this.setF0 = function(t) {
                    this.f0 = t, this.recalculateCoefficients()
                }, this.setDbGain = function(t) {
                    this.dBgain = t, this.recalculateCoefficients()
                }, this.recalculateCoefficients = function() {
                    var s;
                    s = t === e.PEAKING_EQ || t === e.LOW_SHELF || t === e.HIGH_SHELF ? Math.pow(10, this.dBgain / 40) : Math.sqrt(Math.pow(10, this.dBgain / 20));
                    var i = e.TWO_PI * this.f0 / this.Fs,
                        a = Math.cos(i),
                        h = Math.sin(i),
                        r = 0;
                    switch (this.parameterType) {
                        case e.Q:
                            r = h / (2 * this.Q);
                            break;
                        case e.BW:
                            r = h * c(Math.LN2 / 2 * this.BW * i / h);
                            break;
                        case e.S:
                            r = h / 2 * Math.sqrt((s + 1 / s) * (1 / this.S - 1) + 2)
                    }
                    var n;
                    switch (this.type) {
                        case e.LPF:
                            this.b0 = (1 - a) / 2, this.b1 = 1 - a, this.b2 = (1 - a) / 2, this.a0 = 1 + r, this.a1 = -2 * a, this.a2 = 1 - r;
                            break;
                        case e.HPF:
                            this.b0 = (1 + a) / 2, this.b1 = -(1 + a), this.b2 = (1 + a) / 2, this.a0 = 1 + r, this.a1 = -2 * a, this.a2 = 1 - r;
                            break;
                        case e.BPF_CONSTANT_SKIRT:
                            this.b0 = h / 2, this.b1 = 0, this.b2 = -h / 2, this.a0 = 1 + r, this.a1 = -2 * a, this.a2 = 1 - r;
                            break;
                        case e.BPF_CONSTANT_PEAK:
                            this.b0 = r, this.b1 = 0, this.b2 = -r, this.a0 = 1 + r, this.a1 = -2 * a, this.a2 = 1 - r;
                            break;
                        case e.NOTCH:
                            this.b0 = 1, this.b1 = -2 * a, this.b2 = 1, this.a0 = 1 + r, this.a1 = -2 * a, this.a2 = 1 - r;
                            break;
                        case e.APF:
                            this.b0 = 1 - r, this.b1 = -2 * a, this.b2 = 1 + r, this.a0 = 1 + r, this.a1 = -2 * a, this.a2 = 1 - r;
                            break;
                        case e.PEAKING_EQ:
                            this.b0 = 1 + r * s, this.b1 = -2 * a, this.b2 = 1 - r * s, this.a0 = 1 + r / s, this.a1 = -2 * a, this.a2 = 1 - r / s;
                            break;
                        case e.LOW_SHELF:
                            n = h * Math.sqrt((3 ^ s) * (1 / this.S - 1) + 2 * s), this.b0 = s * (s + 1 - (s - 1) * a + n), this.b1 = 2 * s * (s - 1 - (s + 1) * a), this.b2 = s * (s + 1 - (s - 1) * a - n), this.a0 = s + 1 + (s - 1) * a + n, this.a1 = -2 * (s - 1 + (s + 1) * a), this.a2 = s + 1 + (s - 1) * a - n;
                            break;
                        case e.HIGH_SHELF:
                            n = h * Math.sqrt((3 ^ s) * (1 / this.S - 1) + 2 * s), this.b0 = s * (s + 1 + (s - 1) * a + n), this.b1 = -2 * s * (s - 1 + (s + 1) * a), this.b2 = s * (s + 1 + (s - 1) * a - n), this.a0 = s + 1 - (s - 1) * a + n, this.a1 = 2 * (s - 1 - (s + 1) * a), this.a2 = s + 1 - (s - 1) * a - n
                    }
                    this.b0a0 = this.b0 / this.a0, this.b1a0 = this.b1 / this.a0, this.b2a0 = this.b2 / this.a0, this.a1a0 = this.a1 / this.a0, this.a2a0 = this.a2 / this.a0
                }, this.process = function(t) {
                    for (var e = t.length, s = new Float32Array(e), i = 0; i < t.length; i++) s[i] = this.b0a0 * t[i] + this.b1a0 * this.x_1_l + this.b2a0 * this.x_2_l - this.a1a0 * this.y_1_l - this.a2a0 * this.y_2_l, this.y_2_l = this.y_1_l, this.y_1_l = s[i], this.x_2_l = this.x_1_l, this.x_1_l = t[i];
                    return s
                }, this.processStereo = function(t) {
                    for (var e = t.length, s = new Float32Array(e), i = 0; e / 2 > i; i++) s[2 * i] = this.b0a0 * t[2 * i] + this.b1a0 * this.x_1_l + this.b2a0 * this.x_2_l - this.a1a0 * this.y_1_l - this.a2a0 * this.y_2_l, this.y_2_l = this.y_1_l, this.y_1_l = s[2 * i], this.x_2_l = this.x_1_l, this.x_1_l = t[2 * i], s[2 * i + 1] = this.b0a0 * t[2 * i + 1] + this.b1a0 * this.x_1_r + this.b2a0 * this.x_2_r - this.a1a0 * this.y_1_r - this.a2a0 * this.y_2_r, this.y_2_r = this.y_1_r, this.y_1_r = s[2 * i + 1], this.x_2_r = this.x_1_r, this.x_1_r = t[2 * i + 1];
                    return s
                }
            }

            function d(t) {
                this.FS = t, this.minFreq = 40, this.maxFreq = 16e3, this.bandsPerOctave = 1, this.filters = [], this.freqzs = [], this.calculateFreqzs = !0, this.recalculateFilters = function() {
                    var t = Math.round(Math.log(this.maxFreq / this.minFreq) * this.bandsPerOctave / Math.LN2);
                    this.filters = [];
                    for (var s = 0; t > s; s++) {
                        var i = this.minFreq * Math.pow(2, s / this.bandsPerOctave),
                            a = new p(e.PEAKING_EQ, this.FS);
                        a.setDbGain(0), a.setBW(1 / this.bandsPerOctave), a.setF0(i), this.filters[s] = a, this.recalculateFreqz(s)
                    }
                }, this.setMinimumFrequency = function(t) {
                    this.minFreq = t, this.recalculateFilters()
                }, this.setMaximumFrequency = function(t) {
                    this.maxFreq = t, this.recalculateFilters()
                }, this.setBandsPerOctave = function(t) {
                    this.bandsPerOctave = t, this.recalculateFilters()
                }, this.setBandGain = function(t, e) {
                    if (0 > t || t > this.filters.length - 1) throw "The band index of the graphical equalizer is out of bounds.";
                    if (!e) throw "A gain must be passed.";
                    this.filters[t].setDbGain(e), this.recalculateFreqz(t)
                }, this.recalculateFreqz = function(t) {
                    if (this.calculateFreqzs) {
                        if (0 > t || t > this.filters.length - 1) throw "The band index of the graphical equalizer is out of bounds. " + t + " is out of [0, " + this.filters.length - 1 + "]";
                        if (!this.w) {
                            this.w = Float32Array(400);
                            for (var s = 0; s < this.w.length; s++) this.w[s] = Math.PI / this.w.length * s
                        }
                        var i = [this.filters[t].b0, this.filters[t].b1, this.filters[t].b2],
                            a = [this.filters[t].a0, this.filters[t].a1, this.filters[t].a2];
                        this.freqzs[t] = e.mag2db(e.freqz(i, a, this.w))
                    }
                }, this.process = function(t) {
                    for (var e = t, s = 0; s < this.filters.length; s++) e = this.filters[s].process(e);
                    return e
                }, this.processStereo = function(t) {
                    for (var e = t, s = 0; s < this.filters.length; s++) e = this.filters[s].processStereo(e);
                    return e
                }
            }

            function y(t, e, s, i) {
                this.delayBufferSamples = new Float32Array(t), this.delayInputPointer = e, this.delayOutputPointer = 0, this.delayInSamples = e, this.masterVolume = s, this.delayVolume = i
            }

            function m(t, e, s) {
                this.delayBufferSamples = new Float32Array(t), this.delayInputPointer = e, this.delayOutputPointer = 0, this.delayInSamples = e, this.delayVolume = s
            }

            function b(t, s, i, a, h, r) {
                this.delayInSamples = s, this.masterVolume = i, this.mixVolume = a, this.delayVolume = h, this.dampFrequency = r, this.NR_OF_MULTIDELAYS = 6, this.NR_OF_SINGLEDELAYS = 6, this.LOWPASSL = new f(e.LOWPASS, r, 0, 44100), this.LOWPASSR = new f(e.LOWPASS, r, 0, 44100), this.singleDelays = [];
                var n, l;
                for (n = 0; n < this.NR_OF_SINGLEDELAYS; n++) l = 1 + n / 7, this.singleDelays[n] = new m(t, Math.round(this.delayInSamples * l), this.delayVolume);
                for (this.multiDelays = [], n = 0; n < this.NR_OF_MULTIDELAYS; n++) l = 1 + n / 10, this.multiDelays[n] = new y(t, Math.round(this.delayInSamples * l), this.masterVolume, this.delayVolume)
            }
            e = {
                LEFT: 0,
                RIGHT: 1,
                MIX: 2,
                SINE: 1,
                TRIANGLE: 2,
                SAW: 3,
                SQUARE: 4,
                LOWPASS: 0,
                HIGHPASS: 1,
                BANDPASS: 2,
                NOTCH: 3,
                BARTLETT: 1,
                BARTLETTHANN: 2,
                BLACKMAN: 3,
                COSINE: 4,
                GAUSS: 5,
                HAMMING: 6,
                HANN: 7,
                LANCZOS: 8,
                RECTANGULAR: 9,
                TRIANGULAR: 10,
                OFF: 0,
                FW: 1,
                BW: 2,
                FWBW: 3,
                TWO_PI: 2 * Math.PI
            }, t("Float32Array", "WebGLFloatArray"), t("Int32Array", "WebGLIntArray"), t("Uint16Array", "WebGLUnsignedShortArray"), t("Uint8Array", "WebGLUnsignedByteArray"), e.invert = function(t) {
                for (var e = 0, s = t.length; s > e; e++) t[e] *= -1;
                return t
            }, e.interleave = function(t, e) {
                if (t.length !== e.length) throw "Can not interleave. Channel lengths differ.";
                for (var s = new Float32Array(2 * t.length), i = 0, a = t.length; a > i; i++) s[2 * i] = t[i], s[2 * i + 1] = e[i];
                return s
            }, e.deinterleave = function() {
                var t, s, i, a = [];
                return a[e.MIX] = function(t) {
                        for (var e = 0, s = t.length / 2; s > e; e++) i[e] = (t[2 * e] + t[2 * e + 1]) / 2;
                        return i
                    }, a[e.LEFT] = function(e) {
                        for (var s = 0, i = e.length / 2; i > s; s++) t[s] = e[2 * s];
                        return t
                    }, a[e.RIGHT] = function(t) {
                        for (var e = 0, i = t.length / 2; i > e; e++) s[e] = t[2 * e + 1];
                        return s
                    },
                    function(e, h) {
                        return t = t || new Float32Array(h.length / 2), s = s || new Float32Array(h.length / 2), i = i || new Float32Array(h.length / 2), h.length / 2 !== t.length && (t = new Float32Array(h.length / 2), s = new Float32Array(h.length / 2), i = new Float32Array(h.length / 2)), a[e](h)
                    }
            }(), e.getChannel = e.deinterleave, e.mixSampleBuffers = function(t, e, s, i) {
                for (var a = new Float32Array(t), h = 0; h < t.length; h++) a[h] += (s ? -e[h] : e[h]) / i;
                return a
            }, e.LPF = 0, e.HPF = 1, e.BPF_CONSTANT_SKIRT = 2, e.BPF_CONSTANT_PEAK = 3, e.NOTCH = 4, e.APF = 5, e.PEAKING_EQ = 6, e.LOW_SHELF = 7, e.HIGH_SHELF = 8, e.Q = 1, e.BW = 2, e.S = 3, e.RMS = function(t) {
                for (var e = 0, s = 0, i = t.length; i > s; s++) e += t[s] * t[s];
                return Math.sqrt(e / i)
            }, e.Peak = function(t) {
                for (var e = 0, s = 0, i = t.length; i > s; s++) e = Math.abs(t[s]) > e ? Math.abs(t[s]) : e;
                return e
            }, h.prototype.forward = function(t) {
                for (var e = this.real, s = this.imag, i, a, h = 0; h < this.bufferSize / 2; h++) {
                    i = 0, a = 0;
                    for (var r = 0; r < t.length; r++) i += this.cosTable[h * r] * t[r], a += this.sinTable[h * r] * t[r];
                    e[h] = i, s[h] = a
                }
                return this.calculateSpectrum()
            }, s = function v(t, e) {
                a.call(this, t, e), this.reverseTable = new Uint32Array(t);
                for (var s = 1, i = t >> 1, h; t > s;) {
                    for (h = 0; s > h; h++) this.reverseTable[h + s] = this.reverseTable[h] + i;
                    s <<= 1, i >>= 1
                }
                for (this.sinTable = new Float32Array(t), this.cosTable = new Float32Array(t), h = 0; t > h; h++) this.sinTable[h] = Math.sin(-Math.PI / h), this.cosTable[h] = Math.cos(-Math.PI / h)
            }, s.prototype.forward = function(t) {
                var e = this.bufferSize,
                    s = this.cosTable,
                    i = this.sinTable,
                    a = this.reverseTable,
                    h = this.real,
                    r = this.imag,
                    n = this.spectrum,
                    l = Math.floor(Math.log(e) / Math.LN2);
                if (Math.pow(2, l) !== e) throw "Invalid buffer size, must be a power of 2.";
                if (e !== t.length) throw "Supplied buffer is not the same size as defined FFT. FFT Size: " + e + " Buffer Size: " + t.length;
                var o = 1,
                    u, f, c, p, d, y, m, b, v;
                for (v = 0; e > v; v++) h[v] = t[a[v]], r[v] = 0;
                for (; e > o;) {
                    u = s[o], f = i[o], c = 1, p = 0;
                    for (var S = 0; o > S; S++) {
                        for (v = S; e > v;) d = v + o, y = c * h[d] - p * r[d], m = c * r[d] + p * h[d], h[d] = h[v] - y, r[d] = r[v] - m, h[v] += y, r[v] += m, v += o << 1;
                        b = c, c = b * u - p * f, p = b * f + p * u
                    }
                    o <<= 1
                }
                return this.calculateSpectrum()
            }, s.prototype.inverse = function(t, e) {
                var s = this.bufferSize,
                    i = this.cosTable,
                    a = this.sinTable,
                    h = this.reverseTable,
                    r = this.spectrum;
                t = t || this.real, e = e || this.imag;
                var n = 1,
                    l, o, u, f, c, p, d, y, m;
                for (m = 0; s > m; m++) e[m] *= -1;
                var b = new Float32Array(s),
                    v = new Float32Array(s);
                for (m = 0; m < t.length; m++) b[m] = t[h[m]], v[m] = e[h[m]];
                for (t = b, e = v; s > n;) {
                    l = i[n], o = a[n], u = 1, f = 0;
                    for (var S = 0; n > S; S++) {
                        for (m = S; s > m;) c = m + n, p = u * t[c] - f * e[c], d = u * e[c] + f * t[c], t[c] = t[m] - p, e[c] = e[m] - d, t[m] += p, e[m] += d, m += n << 1;
                        y = u, u = y * l - f * o, f = y * o + f * l
                    }
                    n <<= 1
                }
                var g = new Float32Array(s);
                for (m = 0; s > m; m++) g[m] = t[m] / s;
                return g
            }, r.prototype.forward = function(t) {
                var e = this.bufferSize,
                    s = this.spectrum,
                    i = this.trans,
                    a = 2 * Math.PI,
                    h = Math.sqrt,
                    r = e >>> 1,
                    n = 2 / e,
                    l, o, u, f, c, p, d, y, m, b, v, S, g, P, _, A, F, M, T, w, I, L, E, O, B, R;
                this.reverseBinPermute(i, t);
                for (var N = 0, q = 4; e > N; q *= 4) {
                    for (var k = N; e > k; k += q) F = i[k] - i[k + 1], i[k] += i[k + 1], i[k + 1] = F;
                    N = 2 * (q - 1)
                }
                for (l = 2, f = e >>> 1; f >>>= 1;) {
                    N = 0, l <<= 1, q = l << 1, o = l >>> 2, u = l >>> 3;
                    do {
                        if (1 !== o)
                            for (k = N; e > k; k += q) m = k, b = m + o, v = b + o, S = v + o, c = i[v] + i[S], i[S] -= i[v], i[v] = i[m] - c, i[m] += c, m += u, b += u, v += u, S += u, c = i[v] + i[S], p = i[v] - i[S], c = -c * Math.SQRT1_2, p *= Math.SQRT1_2, F = i[b], i[S] = c + F, i[v] = c - F, i[b] = i[m] - p, i[m] += p;
                        else
                            for (k = N; e > k; k += q) m = k, b = m + o, v = b + o, S = v + o, c = i[v] + i[S], i[S] -= i[v], i[v] = i[m] - c, i[m] += c;
                        N = (q << 1) - l, q <<= 2
                    } while (e > N);
                    L = a / l;
                    for (var W = 1; u > W; W++) {
                        E = W * L, T = Math.sin(E), M = Math.cos(E), w = 4 * M * (M * M - .75), I = 4 * T * (.75 - T * T), N = 0, q = l << 1;
                        do {
                            for (k = N; e > k; k += q) m = k + W, b = m + o, v = b + o, S = v + o, g = k + o - W, P = g + o, _ = P + o, A = _ + o, p = i[_] * M - i[v] * T, c = i[_] * T + i[v] * M, y = i[A] * w - i[S] * I, d = i[A] * I + i[S] * w, F = p - y, p += y, y = F, i[A] = p + i[P], i[v] = p - i[P], F = d - c, c += d, d = F, i[S] = d + i[b], i[_] = d - i[b], i[P] = i[m] - c, i[m] += c, i[b] = y + i[g], i[g] -= y;
                            N = (q << 1) - l, q <<= 2
                        } while (e > N)
                    }
                }
                for (; --r;) O = i[r], B = i[e - r - 1], R = n * h(O * O + B * B), R > this.peak && (this.peakBand = r, this.peak = R), s[r] = R;
                return s[0] = n * i[0], s
            }, n.prototype.applyEnvelope = function() {
                return this.envelope.process(this.signal), this.signal
            }, n.prototype.generate = function() {
                for (var t = this.frameCount * this.bufferSize, s = this.playEnd * this.samples.length - this.playStart * this.samples.length, i = this.playStart * this.samples.length, a = this.playEnd * this.samples.length, h, r = 0; r < this.bufferSize; r++) {
                    switch (this.loopMode) {
                        case e.OFF:
                            this.playhead = Math.round(this.samplesProcessed * this.step + i), this.playhead < this.playEnd * this.samples.length ? this.signal[r] = this.samples[this.playhead] * this.amplitude : this.signal[r] = 0;
                            break;
                        case e.FW:
                            this.playhead = Math.round(this.samplesProcessed * this.step % s + i), this.playhead < this.playEnd * this.samples.length && (this.signal[r] = this.samples[this.playhead] * this.amplitude);
                            break;
                        case e.BW:
                            this.playhead = a - Math.round(this.samplesProcessed * this.step % s), this.playhead < this.playEnd * this.samples.length && (this.signal[r] = this.samples[this.playhead] * this.amplitude);
                            break;
                        case e.FWBW:
                            Math.floor(this.samplesProcessed * this.step / s) % 2 === 0 ? this.playhead = Math.round(this.samplesProcessed * this.step % s + i) : this.playhead = a - Math.round(this.samplesProcessed * this.step % s), this.playhead < this.playEnd * this.samples.length && (this.signal[r] = this.samples[this.playhead] * this.amplitude)
                    }
                    this.samplesProcessed++
                }
                return this.frameCount++, this.signal
            }, n.prototype.setFreq = function(t) {
                var e = this.samplesProcessed * this.step;
                this.frequency = t, this.step = this.frequency / this.rootFrequency, this.samplesProcessed = Math.round(e / this.step)
            }, n.prototype.reset = function() {
                this.samplesProcessed = 0, this.playhead = 0
            }, l.prototype.setAmp = function(t) {
                if (!(t >= 0 && 1 >= t)) throw "Amplitude out of range (0..1).";
                this.amplitude = t
            }, l.prototype.setFreq = function(t) {
                this.frequency = t, this.cyclesPerSample = t / this.sampleRate
            }, l.prototype.add = function(t) {
                for (var e = 0; e < this.bufferSize; e++) this.signal[e] += t.signal[e];
                return this.signal
            }, l.prototype.addSignal = function(t) {
                for (var e = 0; e < t.length && !(e >= this.bufferSize); e++) this.signal[e] += t[e];
                return this.signal
            }, l.prototype.addEnvelope = function(t) {
                this.envelope = t
            }, l.prototype.applyEnvelope = function() {
                this.envelope.process(this.signal)
            }, l.prototype.valueAt = function(t) {
                return this.waveTable[t % this.waveTableLength]
            }, l.prototype.generate = function() {
                for (var t = this.frameCount * this.bufferSize, e = this.waveTableLength * this.frequency / this.sampleRate, s, i = 0; i < this.bufferSize; i++) s = Math.round((t + i) * e), this.signal[i] = this.waveTable[s % this.waveTableLength] * this.amplitude;
                return this.frameCount++, this.signal
            }, l.Sine = function(t) {
                return Math.sin(e.TWO_PI * t)
            }, l.Square = function(t) {
                return .5 > t ? 1 : -1
            }, l.Saw = function(t) {
                return 2 * (t - Math.round(t))
            }, l.Triangle = function(t) {
                return 1 - 4 * Math.abs(Math.round(t) - t)
            }, l.Pulse = function(t) {}, o.prototype.noteOn = function() {
                this.samplesProcessed = 0, this.sustainSamples = this.sustainLength * this.sampleRate, this.update()
            }, o.prototype.noteOff = function() {
                this.sustainSamples = this.samplesProcessed - this.decaySamples, this.update()
            }, o.prototype.processSample = function(t) {
                var e = 0;
                return this.samplesProcessed <= this.attack ? e = 0 + 1 * ((this.samplesProcessed - 0) / (this.attack - 0)) : this.samplesProcessed > this.attack && this.samplesProcessed <= this.decay ? e = 1 + (this.sustainLevel - 1) * ((this.samplesProcessed - this.attack) / (this.decay - this.attack)) : this.samplesProcessed > this.decay && this.samplesProcessed <= this.sustain ? e = this.sustainLevel : this.samplesProcessed > this.sustain && this.samplesProcessed <= this.release && (e = this.sustainLevel + (0 - this.sustainLevel) * ((this.samplesProcessed - this.sustain) / (this.release - this.sustain))), t * e
            }, o.prototype.value = function() {
                var t = 0;
                return this.samplesProcessed <= this.attack ? t = 0 + 1 * ((this.samplesProcessed - 0) / (this.attack - 0)) : this.samplesProcessed > this.attack && this.samplesProcessed <= this.decay ? t = 1 + (this.sustainLevel - 1) * ((this.samplesProcessed - this.attack) / (this.decay - this.attack)) : this.samplesProcessed > this.decay && this.samplesProcessed <= this.sustain ? t = this.sustainLevel : this.samplesProcessed > this.sustain && this.samplesProcessed <= this.release && (t = this.sustainLevel + (0 - this.sustainLevel) * ((this.samplesProcessed - this.sustain) / (this.release - this.sustain))), t
            }, o.prototype.process = function(t) {
                for (var e = 0; e < t.length; e++) t[e] *= this.value(), this.samplesProcessed++;
                return t
            }, o.prototype.isActive = function() {
                return this.samplesProcessed > this.release || -1 === this.samplesProcessed ? !1 : !0
            }, o.prototype.disable = function() {
                this.samplesProcessed = -1
            }, u.prototype.__defineGetter__("cutoff", function() {
                return this.func.cutoff
            }), u.prototype.__defineGetter__("resonance", function() {
                return this.func.resonance
            }), u.prototype.set = function(t, e) {
                this.func.calcCoeff(t, e)
            }, u.prototype.process = function(t) {
                this.func.process(t)
            }, u.prototype.addEnvelope = function(t) {
                if (!(t instanceof o)) throw "Not an envelope.";
                this.func.addEnvelope(t)
            }, u.LP12 = function(t, e, s) {
                this.sampleRate = s, this.vibraPos = 0, this.vibraSpeed = 0, this.envelope = !1, this.calcCoeff = function(t, e) {
                    this.w = 2 * Math.PI * t / this.sampleRate, this.q = 1 - this.w / (2 * (e + .5 / (1 + this.w)) + this.w - 2), this.r = this.q * this.q, this.c = this.r + 1 - 2 * Math.cos(this.w) * this.q, this.cutoff = t, this.resonance = e
                }, this.calcCoeff(t, e), this.process = function(t) {
                    for (var e = 0; e < t.length; e++) this.vibraSpeed += (t[e] - this.vibraPos) * this.c, this.vibraPos += this.vibraSpeed, this.vibraSpeed *= this.r, this.envelope ? (t[e] = t[e] * (1 - this.envelope.value()) + this.vibraPos * this.envelope.value(), this.envelope.samplesProcessed++) : t[e] = this.vibraPos
                }
            }, u.LP12.prototype.addEnvelope = function(t) {
                this.envelope = t
            }, f.prototype.process = function(t) {
                for (var e, s, i = this.f, a = 0; a < t.length; a++) e = t[a], i[3] = e - this.damp * i[2], i[0] = i[0] + this.freq * i[2], i[1] = i[3] - i[0], i[2] = this.freq * i[1] + i[2], s = .5 * i[this.type], i[3] = e - this.damp * i[2], i[0] = i[0] + this.freq * i[2], i[1] = i[3] - i[0], i[2] = this.freq * i[1] + i[2], s += .5 * i[this.type], this.envelope ? (t[a] = t[a] * (1 - this.envelope.value()) + s * this.envelope.value(), this.envelope.samplesProcessed++) : t[a] = s
            }, f.prototype.addEnvelope = function(t) {
                if (!(t instanceof o)) throw "This is not an envelope.";
                this.envelope = t
            }, f.prototype.set = function(t, e) {
                this.calcCoeff(t, e)
            }, i = function S(t, s) {
                switch (this.alpha = s, t) {
                    case e.BARTLETT:
                        this.func = S.Bartlett;
                        break;
                    case e.BARTLETTHANN:
                        this.func = S.BartlettHann;
                        break;
                    case e.BLACKMAN:
                        this.func = S.Blackman, this.alpha = this.alpha || .16;
                        break;
                    case e.COSINE:
                        this.func = S.Cosine;
                        break;
                    case e.GAUSS:
                        this.func = S.Gauss, this.alpha = this.alpha || .25;
                        break;
                    case e.HAMMING:
                        this.func = S.Hamming;
                        break;
                    case e.HANN:
                        this.func = S.Hann;
                        break;
                    case e.LANCZOS:
                        this.func = S.Lanczoz;
                        break;
                    case e.RECTANGULAR:
                        this.func = S.Rectangular;
                        break;
                    case e.TRIANGULAR:
                        this.func = S.Triangular
                }
            }, i.prototype.process = function(t) {
                for (var e = t.length, s = 0; e > s; s++) t[s] *= this.func(e, s, this.alpha);
                return t
            }, i.Bartlett = function(t, e) {
                return 2 / (t - 1) * ((t - 1) / 2 - Math.abs(e - (t - 1) / 2))
            }, i.BartlettHann = function(t, s) {
                return .62 - .48 * Math.abs(s / (t - 1) - .5) - .38 * Math.cos(e.TWO_PI * s / (t - 1))
            }, i.Blackman = function(t, s, i) {
                var a = (1 - i) / 2,
                    h = .5,
                    r = i / 2;
                return a - h * Math.cos(e.TWO_PI * s / (t - 1)) + r * Math.cos(4 * Math.PI * s / (t - 1))
            }, i.Cosine = function(t, e) {
                return Math.cos(Math.PI * e / (t - 1) - Math.PI / 2)
            }, i.Gauss = function(t, e, s) {
                return Math.pow(Math.E, -.5 * Math.pow((e - (t - 1) / 2) / (s * (t - 1) / 2), 2))
            }, i.Hamming = function(t, s) {
                return .54 - .46 * Math.cos(e.TWO_PI * s / (t - 1))
            }, i.Hann = function(t, s) {
                return .5 * (1 - Math.cos(e.TWO_PI * s / (t - 1)))
            }, i.Lanczos = function(t, e) {
                var s = 2 * e / (t - 1) - 1;
                return Math.sin(Math.PI * s) / (Math.PI * s)
            }, i.Rectangular = function(t, e) {
                return 1
            }, i.Triangular = function(t, e) {
                return 2 / t * (t / 2 - Math.abs(e - (t - 1) / 2))
            }, e.mag2db = function(t) {
                for (var e = -120, s = Math.pow(10, e / 20), i = Math.log, a = Math.max, h = new Float32Array(t.length), r = 0; r < t.length; r++) h[r] = 20 * i(a(t[r], s));
                return h
            }, e.freqz = function(t, s, i) {
                var a, h;
                if (!i)
                    for (i = Float32Array(200), a = 0; a < i.length; a++) i[a] = e.TWO_PI / i.length * a - Math.PI;
                var r = Float32Array(i.length),
                    n = Math.sqrt,
                    l = Math.cos,
                    o = Math.sin;
                for (a = 0; a < i.length; a++) {
                    var u = {
                        real: 0,
                        imag: 0
                    };
                    for (h = 0; h < t.length; h++) u.real += t[h] * l(-h * i[a]), u.imag += t[h] * o(-h * i[a]);
                    var f = {
                        real: 0,
                        imag: 0
                    };
                    for (h = 0; h < s.length; h++) f.real += s[h] * l(-h * i[a]), f.imag += s[h] * o(-h * i[a]);
                    r[a] = n(u.real * u.real + u.imag * u.imag) / n(f.real * f.real + f.imag * f.imag)
                }
                return r
            }, y.prototype.setDelayInSamples = function(t) {
                this.delayInSamples = t, this.delayInputPointer = this.delayOutputPointer + t, this.delayInputPointer >= this.delayBufferSamples.length - 1 && (this.delayInputPointer = this.delayInputPointer - this.delayBufferSamples.length)
            }, y.prototype.setMasterVolume = function(t) {
                this.masterVolume = t
            }, y.prototype.setDelayVolume = function(t) {
                this.delayVolume = t
            }, y.prototype.process = function(t) {
                for (var e = new Float32Array(t.length), s = 0; s < t.length; s++) {
                    var i = null === this.delayBufferSamples[this.delayOutputPointer] ? 0 : this.delayBufferSamples[this.delayOutputPointer],
                        a = i * this.delayVolume + t[s];
                    this.delayBufferSamples[this.delayInputPointer] = a, e[s] = a * this.masterVolume, this.delayInputPointer++, this.delayInputPointer >= this.delayBufferSamples.length - 1 && (this.delayInputPointer = 0), this.delayOutputPointer++, this.delayOutputPointer >= this.delayBufferSamples.length - 1 && (this.delayOutputPointer = 0)
                }
                return e
            }, m.prototype.setDelayInSamples = function(t) {
                this.delayInSamples = t, this.delayInputPointer = this.delayOutputPointer + t, this.delayInputPointer >= this.delayBufferSamples.length - 1 && (this.delayInputPointer = this.delayInputPointer - this.delayBufferSamples.length)
            }, m.prototype.setDelayVolume = function(t) {
                this.delayVolume = t
            }, m.prototype.process = function(t) {
                for (var e = new Float32Array(t.length), s = 0; s < t.length; s++) {
                    this.delayBufferSamples[this.delayInputPointer] = t[s];
                    var i = this.delayBufferSamples[this.delayOutputPointer];
                    e[s] = i * this.delayVolume, this.delayInputPointer++, this.delayInputPointer >= this.delayBufferSamples.length - 1 && (this.delayInputPointer = 0), this.delayOutputPointer++, this.delayOutputPointer >= this.delayBufferSamples.length - 1 && (this.delayOutputPointer = 0)
                }
                return e
            }, b.prototype.setDelayInSamples = function(t) {
                this.delayInSamples = t;
                var e, s;
                for (e = 0; e < this.NR_OF_SINGLEDELAYS; e++) s = 1 + e / 7, this.singleDelays[e].setDelayInSamples(Math.round(this.delayInSamples * s));
                for (e = 0; e < this.NR_OF_MULTIDELAYS; e++) s = 1 + e / 10, this.multiDelays[e].setDelayInSamples(Math.round(this.delayInSamples * s))
            }, b.prototype.setMasterVolume = function(t) {
                this.masterVolume = t
            }, b.prototype.setMixVolume = function(t) {
                this.mixVolume = t
            }, b.prototype.setDelayVolume = function(t) {
                this.delayVolume = t;
                var e;
                for (e = 0; e < this.NR_OF_SINGLEDELAYS; e++) this.singleDelays[e].setDelayVolume(this.delayVolume);
                for (e = 0; e < this.NR_OF_MULTIDELAYS; e++) this.multiDelays[e].setDelayVolume(this.delayVolume)
            }, b.prototype.setDampFrequency = function(t) {
                this.dampFrequency = t, this.LOWPASSL.set(t, 0), this.LOWPASSR.set(t, 0)
            }, b.prototype.process = function(t) {
                var s = new Float32Array(t.length),
                    i = e.deinterleave(t);
                this.LOWPASSL.process(i[e.LEFT]), this.LOWPASSR.process(i[e.RIGHT]);
                var a = e.interleave(i[e.LEFT], i[e.RIGHT]),
                    h;
                for (h = 0; h < this.NR_OF_MULTIDELAYS; h++) s = e.mixSampleBuffers(s, this.multiDelays[h].process(a), 2 % h === 0, this.NR_OF_MULTIDELAYS);
                var r = new Float32Array(s.length);
                for (h = 0; h < this.NR_OF_SINGLEDELAYS; h++) r = e.mixSampleBuffers(r, this.singleDelays[h].process(s), 2 % h === 0, 1);
                for (h = 0; h < r.length; h++) r[h] *= this.mixVolume;
                for (s = e.mixSampleBuffers(r, t, 0, 1), h = 0; h < s.length; h++) s[h] *= this.masterVolume;
                return s
            }
        }).call(this)
    }).call(this), "undefined" == typeof Package && (Package = {}), Package["flowkey:dsp"] = {
        DSP: e,
        DFT: a,
        FFT: s,
        Oscillator: h,
        ADSR: r,
        IIRFilter: n,
        MultiDelay: l,
        WindowFunction: i
    }
}();

! function() {
    var r = Package.meteor.Meteor,
        n, t, e, a, o, u, i, c, f, l, h, g, v, M, s, y, d, m, p, q, A, F, w, k, B, T, b, O;
    (function() {
        (function() {
            n = function(r) {
                for (var n = new Array(r), t = r; t--;) n[t] = 0;
                return n
            }, t = function(r) {
                return Math.pow(10, .05 * r)
            }, e = function(r) {
                return 20 * Math.log(r) / Math.LN10
            }, a = function(r) {
                return Math.pow(2, r / 100 / 12)
            }, o = function(r) {
                return 1200 * (Math.log(r) / Math.log(2))
            }, u = function(r, n) {
                return Math.pow(2, (r - 69) / 12) * n
            }, i = function(r, n) {
                return Math.round(69 + 12 * Math.log(r / n) / Math.log(2))
            }, c = function(r, n, t, e) {
                var a = Math.round(n * r * e / t);
                return a
            }, f = function(r, n, t) {
                var e = n / t * r;
                return e
            }, l = function(r, n, t, e) {
                console.warn("getBin() is deprecated, use calculateBinFromFrequency() instead");
                var a = Math.round(n * r * t / e * 2);
                return a
            }, h = function(r, n, t) {
                console.warn("getFreq() is deprecated, use calculateFrequencyFromBin() instead");
                var e = t / n * r;
                return e
            }, g = function(r) {
                for (var n = 0, t = r.length - 1; t >= 0; t--) n += r[t] * r[t];
                return n /= r.length, n = Math.sqrt(n)
            }, v = function(r) {
                for (var n = -(1 / 0), t = 0; t < r.length; t++) n < r[t] && (n = r[t]);
                return n
            }, M = function(r) {
                for (var n = +(1 / 0), t = 0; t < r.length; t++) n > r[t] && (n = r[t]);
                return n
            }, s = function(r) {
                for (var n = 0, t = r.length - 1; t >= 0; t--) n += r[t];
                return n
            }, y = function(r) {
                for (var n = 0, t = r.length - 1; t >= 0; t--) n += Math.abs(r[t]);
                return n
            }, d = function(r) {
                return r.slice()
            }, m = function(r) {
                for (var n = 0, t = r.length - 1; t >= 0; t--) n += r[t];
                var e = n / r.length;
                return e
            }, p = function(r) {
                var n = b(r.slice()),
                    t = Math.floor(n.length / 2);
                return 1 & n.length ? n[t] : (n[t - 1] + n[t]) / 2
            }, q = function(r) {
                var n = b(r.slice()),
                    t = Math.floor(n.length / 2);
                return 1 & n.length ? n[t] : .25 * (n[t - 1] + n[t])
            }, A = function(r) {
                var n = b(r.slice()),
                    t = Math.floor(n.length / 2);
                return 1 & n.length ? n[t] : .75 * (n[t - 1] + n[t])
            }, F = function(r) {
                return A(r) - q(r)
            }, w = function(r) {
                for (var n = m(r), t = r.length, e = 0; t--;) e += Math.pow(r[t] - n, 2);
                return e /= r.length
            }, k = function(r) {
                var n = Math.sqrt(w(r));
                return n
            }, B = function(r, n, t) {
                if ("undefined" == typeof t && (t = Math.max(Math.round(n - r) + 1, 1)), 2 > t) return 1 === t ? [r] : [];
                var e, a = Array(t);
                for (t--, e = t; e >= 0; e--) a[e] = (e * n + (t - e) * r) / t;
                return a
            }, T = function(r, n) {
                for (var t = new Array(n), e = Math.floor(r / n), a = r - n * Math.floor(r / n), o = 1; n >= o; o++) t[o - 1] = e, a >= o && (t[o - 1] += 1);
                return t
            }
        }).call(this),
            function() {
                b = function() {
                    "use strict";
                    return function(r) {
                        var n = r.length,
                            t = 0,
                            e = 0,
                            a = 0,
                            o, u = ~~(.125 * n),
                            i = r[0],
                            c = 0,
                            f = 0,
                            l = new Array(u);
                        for (t = 0; u > t; t++) l[t] = 0;
                        for (t = 1; n > t; ++t) {
                            var h = r[t];
                            i > h && (i = h), h > r[c] && (c = t)
                        }
                        var g = r[c];
                        if (i === g) return r;
                        var v = (u - 1) / (g - i);
                        for (t = 0; n > t; ++t) ++l[~~(v * (r[t] - i))];
                        for (a = 1; u > a; ++a) l[a] += l[a - 1];
                        var M = g;
                        r[c] = r[0], r[0] = M;
                        var s;
                        for (e = 0, a = u - 1, t = n - 1; t > f;) {
                            for (; e > l[a] - 1;) a = ~~(v * (r[++e] - i));
                            if (0 > a) break;
                            for (s = r[e]; e !== l[a];) a = ~~(v * (s - i)), M = r[o = --l[a]], r[o] = s, s = M, ++f
                        }
                        for (e = 1; n > e; ++e) {
                            for (M = r[e], t = e - 1; t >= 0 && r[t] > M;) r[t + 1] = r[t--];
                            r[t + 1] = M
                        }
                        return r
                    }
                }()
            }.call(this)
    }).call(this), "undefined" == typeof Package && (Package = {}), Package["flowkey:math-tools"] = {
        zArray: n,
        linearToDecibel: e,
        decibelToLinear: t,
        getRmsOfArray: g,
        getMaxOfArray: v,
        copyArray: d,
        getMinOfArray: M,
        getSumOfArray: s,
        getAbsSumOfArray: y,
        centToFrequencyRatio: a,
        frequencyRatioToCent: o,
        midiToFrequency: u,
        frequencyToMidi: i,
        calculateBinFromFrequency: c,
        calculateFrequencyFromBin: f,
        getBin: l,
        flashsort: O,
        getFreq: h,
        mean: m,
        median: p,
        firstQuartile: q,
        thirdQuartile: A,
        interQuartileRange: F,
        variance: w,
        standardDeviation: k,
        createLinearSpace: B,
        calculateMappingElementCountVector: T
    }
}();

! function() {
    var n = Package.meteor.Meteor,
        t = Package.underscore._,
        o;
    (function() {
        (function() {
            function e(n, t) {
                setTimeout(function() {
                    n(t)
                }, 0)
            }
            o = function() {
                this.functions = []
            }, t.extend(o.prototype, {
                add: function(o) {
                    if (!t.isFunction(o)) throw new n.Error(100, "Error 100: Passed Variable seems not be a function");
                    this.functions.push(o)
                },
                runAll: function(n) {
                    var t = this,
                        o = t.functions.length,
                        e = t.functions.length,
                        i = n;
                    if (0 !== o)
                        for (; e--;) this.functions[o - e - 1](i)
                },
                runQueue: function() {}
            })
        }).call(this)
    }).call(this), "undefined" == typeof Package && (Package = {}), Package["flowkey:functionstack"] = {
        FunctionStack: o
    }
}();



! function() {
    var t = Package.meteor.Meteor,
        e = Package.underscore._,
        i = Package["flowkey:functionstack"].FunctionStack,
        r = Package["flowkey:math-tools"].zArray,
        a = Package["flowkey:math-tools"].linearToDecibel,
        o = Package["flowkey:math-tools"].decibelToLinear,
        s = Package["flowkey:math-tools"].getRmsOfArray,
        n = Package["flowkey:math-tools"].getMaxOfArray,
        h = Package["flowkey:math-tools"].copyArray,
        f = Package["flowkey:math-tools"].getMinOfArray,
        u = Package["flowkey:math-tools"].getSumOfArray,
        c = Package["flowkey:math-tools"].getAbsSumOfArray,
        l = Package["flowkey:math-tools"].centToFrequencyRatio,
        m = Package["flowkey:math-tools"].frequencyRatioToCent,
        p = Package["flowkey:math-tools"].midiToFrequency,
        g = Package["flowkey:math-tools"].frequencyToMidi,
        y = Package["flowkey:math-tools"].calculateBinFromFrequency,
        k = Package["flowkey:math-tools"].calculateFrequencyFromBin,
        d = Package["flowkey:math-tools"].getBin,
        v = Package["flowkey:math-tools"].flashsort,
        b = Package["flowkey:math-tools"].getFreq,
        S = Package["flowkey:math-tools"].mean,
        w = Package["flowkey:math-tools"].median,
        P = Package["flowkey:math-tools"].firstQuartile,
        z = Package["flowkey:math-tools"].thirdQuartile,
        R = Package["flowkey:math-tools"].interQuartileRange,
        M = Package["flowkey:math-tools"].variance,
        A = Package["flowkey:math-tools"].standardDeviation,
        B = Package["flowkey:math-tools"].createLinearSpace,
        F = Package["flowkey:math-tools"].calculateMappingElementCountVector,
        C = Package["flowkey:numeric"].numeric,
        L, q, x, N, T, V, W, O, j, E, Q, D, U, X, Z, H, _;
    (function() {
        var e = t.settings ? t.settings["public"].debug : !0,
            i = function(t) {
                e && console.log("[AudioFeatures] " + t)
            }
    }).call(this),
        function() {
            L = function(t) {
                var t = t || {};
                q = t.debug || !1;
                var e = this;
                this.injections = new i, this.fftSize = t.blockLength / 2, this.binThreshold = t.binThreshold, this.emphWindowSize = t.emphWindowSize, this.binSpectrumBufferLength = t.binSpectrumBufferLength, this.highestPeaksCount = t.highestPeaksCount, this.emphasizedSpectrum = new Float32Array(this.fftSize), this.binarizedSpectrum = new Float32Array(this.fftSize), this.activationArray = new Float32Array(this.fftSize), this.binSpectrumBuffer = new Array(this.binSpectrumBufferLength);
                for (var r = this.binSpectrumBufferLength - 1; r >= 0; r--) this.binSpectrumBuffer[r] = new Float32Array(this.fftSize)
            }, e.extend(L.prototype, {
                zeroBinSpectrumBuffer: function() {
                    for (var t = this.binSpectrumBufferLength - 1; t >= 0; t--) this.binSpectrumBuffer[t] = new Float32Array(this.fftSize)
                },
                compute: function(t) {
                    var t = new Float32Array(t),
                        e = this.computeEmphasized(t),
                        i = this.computeBinarized(e),
                        r = this.computeCfa(),
                        a = this.peakPicking(r),
                        o = 0;
                    if (a.length > 0) {
                        var s = this.sortPeaks(a.slice());
                        o = this.computeCfaValue(s)
                    }
                    return this.injections.runAll({
                        cfaArray: r,
                        cfaValue: o,
                        threshold: 1
                    }), o
                },
                computeEmphasized: function(t) {
                    for (var e = 0; e < this.fftSize; e++) {
                        var i = Math.round(Math.max(0, e - this.emphWindowSize / 2)),
                            r = Math.round(Math.min(this.fftSize - 1, e + this.emphWindowSize / 2)),
                            a = t.subarray(i, r);
                        this.emphasizedSpectrum[e] = Math.max(t[e] - S(a), 0)
                    }
                    return this.emphasizedSpectrum
                },
                computeBinarized: function(t) {
                    for (var e = new Float32Array(this.fftSize), i = this.fftSize - 1; i >= 0; i--) t[i] > this.binThreshold ? e[i] = 1 : e[i] = 0;
                    return this.binSpectrumBuffer.shift(), this.binSpectrumBuffer.push(e), e
                },
                computeCfa: function() {
                    for (var t = this.fftSize - 1; t >= 0; t--) {
                        for (var e = 0, i = this.binSpectrumBuffer.length - 1; i >= 0; i--) e += this.binSpectrumBuffer[i][t];
                        this.activationArray[t] = e / this.binSpectrumBuffer.length
                    }
                    return this.activationArray
                },
                sortPeaks: function(t) {
                    var e = t.sort(function(t, e) {
                        return e - t
                    });
                    return e
                },
                computeCfaValue: function(t) {
                    for (var e = this.highestPeaksCount, i = 0; e--;) i += "undefined" != typeof t[e] ? t[e] : 0;
                    return i
                },
                peakPicking: function(t) {
                    for (var e = [], i = t.length - 2; i >= 1; i--)
                        if (t[i] > t[i - 1] && t[i] > t[i + 1]) {
                            var r = this.computePeakValue(t, i);
                            isNaN(r) || e.push(r)
                        }
                    return e
                },
                computePeakValue: function(t, e) {
                    for (var i = e, r = !1; 0 == r;) t[i] < t[i - 1] && t[i] < t[i + 1] ? r = !0 : (i--, 0 >= i && (r = !0));
                    for (var a = e, o = !1; 0 == o;) t[a] < t[a - 1] && t[a] < t[a + 1] ? o = !0 : (a++, a >= t.length - 1 && (o = !0));
                    var s = t[e] - t[i],
                        n = t[e] - t[a],
                        h = Math.min(s, n),
                        f;
                    f = t[e] - t[i] < t[e] - t[a] ? e - i : a - e;
                    var u = h / f;
                    return u
                },
                inject: function(t) {
                    this.injections.add(t)
                }
            })
        }.call(this),
        function() {
            x = function(t) {
                var t = t || {};
                q = t.debug || !1;
                var e = this;
                e.normMethods = {
                    SUM: 0,
                    MAX: 1,
                    SQRT: 2
                }, e.sampleRate = t.sampleRate, e.fftSize = t.blockLength, e.tuningRef = 440, e.midiNumberForA = 69, e.chromaLength = 12, e.midiStartNumber = t.midiStartNumber, e.midiEndNumber = t.midiEndNumber || 109, e.lowerFrequencyRatio = l(-30), e.upperFrequencyRatio = l(30), e.tolerance = !0, e.normMethod = e.normMethods.SQRT, e.computePitches()
            }, e.extend(x.prototype, {
                compute: function(t) {
                    for (var e = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], i = this.semitonePitches.length - 1; i >= 0; i--) {
                        var r = (this.midiStartNumber + i) % this.chromaLength,
                            a = y(this.semitonePitches[i], 1, this.sampleRate, this.fftSize);
                        if (1 == this.tolerance) {
                            var o = y(this.semitonePitches[i], this.upperFrequencyRatio, this.sampleRate, this.fftSize),
                                s = y(this.semitonePitches[i], this.lowerFrequencyRatio, this.sampleRate, this.fftSize);
                            e[r] += u(t.subarray(s, o + 1))
                        } else e[r] += t[a]
                    }
                    return e
                },
                computeStarkPlumbleyChroma: function(t) {
                    for (var e = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], i = 0; i < this.semitonePitches.length; i++) {
                        var r = (this.midiStartNumber + i) % this.chromaLength,
                            a = y(this.semitonePitches[i], 1, this.sampleRate, this.fftSize);
                        if (1 == tolerance) {
                            var a = y(this.semitonePitches[i], 1, this.sampleRate, this.fftSize),
                                o = y(this.semitonePitches[i], this.upperFrequencyRatio, this.sampleRate, this.fftSize),
                                s = y(this.semitonePitches[i], this.lowerFrequencyRatio, this.sampleRate, this.fftSize),
                                h = 0;
                            h = 2 > o - s ? t[a] : n(t.subarray(s, o + 1)), e[r] += h
                        } else e[r] += t[a]
                    }
                    return e
                },
                computePitches: function() {
                    var t = this;
                    t.semitonePitches = [];
                    for (var e = t.midiStartNumber; e < t.midiEndNumber; e++) t.semitonePitches.push(p(e, t.tuningRef))
                },
                normalizeChroma: function(t) {
                    var e = new Array(this.chromaLength);
                    if (this.normMethod == this.normMethods.SUM) {
                        for (var i = 0, r = 11; r >= 0; r--) t[r] = t[r] * t[r], i += t[r];
                        for (var r = 11; r >= 0; r--) e[r] = t[r] / i
                    } else if (this.normMethod == this.normMethods.MAX)
                        for (var a = n(t), r = 11; r >= 0; r--) e[r] = t[r] / a;
                    else if (this.normMethod == this.normMethods.SQRT) {
                        for (var i = 0, r = 11; r >= 0; r--) t[r] = t[r] * t[r], i += t[r];
                        for (var o = Math.sqrt(i), r = 11; r >= 0; r--) e[r] = t[r] / o
                    } else e = t.slice();
                    return e
                }
            })
        }.call(this),
        function() {
            N = function(t) {
                q = t.debug || !1;
                var e = this;
                this.fftSize = t.blockLength / 2, this.sampleRate = t.sampleRate, this.previousBlock = new Float32Array(this.fftSize);
                for (var i in t) e[i] = t[i]
            }, e.extend(N.prototype, {
                compute: function(t) {
                    for (var e = t.length, i = 0, r = 0; e > r; r++) i += this.weighting(r, e) * Math.pow(t[r], 2);
                    return i
                },
                weighting: function(t, e) {
                    var i = Math.pow(t / e, 2);
                    return i
                }
            })
        }.call(this),
        function() {
            T = function(t) {}, e.extend(T.prototype, {
                compute: function(t) {
                    for (var e = 0, i = t.length - 1; i >= 0; i--) e += t[i] * t[i];
                    return e /= t.length, e = Math.sqrt(e)
                }
            })
        }.call(this),
        function() {
            V = function(t) {
                q = t.debug || !1;
                var e = this;
                this.fftSize = t.blockLength / 2, this.sampleRate = t.sampleRate, this.square = !1;
                for (var i in t) e[i] = t[i];
                this.weighting = new Float32Array(this.fftSize / 2);
                for (var r = this.weighting.length - 1; r >= 0; r--) this.weighting[r] = r;
                this.centroid = 0, this.smoothWithLast = !1, this.lastCentroidBin = 0
            }, e.extend(V.prototype, {
                compute: function(t) {
                    if (this.square)
                        for (var e = t.length - 1; e >= 0; e--) t[e] = Math.pow(t[e], 2);
                    for (var i = u(t), r = 0, e = 0; e < t.length; e++) r += this.weighting[e] * t[e];
                    var a = r / i;
                    this.smoothWithLast && (a = (a + this.lastCentroidBin) / 2), this.lastCentroidBin = a, .01 > i && (a = 0), this.onNewCentroid && this.onNewCentroid(a);
                    var o = b(a, this.fftSize, this.sampleRate);
                    return o
                }
            }), W = function(t) {
                V.apply(this, arguments), this.buffer = new r(t.bufferLength)
            }, W.prototype = Object.create(V.prototype), W.prototype.compute = function(t) {
                if (this.square)
                    for (var e = t.length - 1; e >= 0; e--) t[e] = Math.pow(t[e], 2);
                for (var i = u(t), r = 0, e = 0; e < t.length; e++) r += this.weighting[e] * t[e];
                var a = r / i;
                this.smoothWithLast && (a = (a + this.lastCentroidBin) / 2), this.lastCentroidBin = a, .005 > i && (a = 0);
                var o = b(a, this.fftSize, this.sampleRate);
                this.buffer.shift(), this.buffer.push(o);
                var s = M(this.buffer);
                return s
            }
        }.call(this),
        function() {
            O = function(t) {
                var t = t || {};
                q = t.debug || !1;
                var e = this;
                this.fftSize = t.blockLength / 2, this.previousBlock = new Float32Array(this.fftSize);
                for (var i in t) e[i] = t[i]
            }, e.extend(O.prototype, {
                compute: function(t) {
                    for (var e = 0, i = 0; i < t.length; i++) {
                        var r = t[i] - this.previousBlock[i];
                        r = (r + Math.abs(r)) / 2, r *= r, e += r
                    }
                    return e = Math.sqrt(e), e /= t.length, this.previousBlock.set(t.subarray(0)), e
                }
            }), j = function(t) {
                O.apply(this, arguments), this.buffer = new r(t.bufferLength)
            }, j.prototype = Object.create(O.prototype), j.prototype.compute = function(t) {
                for (var e = 0, i = 0; i < t.length; i++) {
                    var r = Math.abs(t[i]),
                        a = Math.abs(this.previousBlock[i]),
                        o = r - a;
                    this.hwrFlag && (o = (o + Math.abs(o)) / 2), o *= o, e += o
                }
                e = Math.sqrt(e), e /= t.length, this.previousBlock.set(t.subarray(0)), this.buffer.shift(), this.buffer.push(e);
                var s = M(this.buffer);
                return s
            }
        }.call(this),
        function() {
            E = function(t) {
                q = t.debug || !1;
                var e = this;
                this.fftSize = t.blockLength / 2, this.sampleRate = t.sampleRate, this.kappa = .95, this.buffer = new r(t.bufferLength);
                for (var i in t) e[i] = t[i];
                this.lastRolloffBin = 0, this.smoothWithLast = !1
            }, e.extend(E.prototype, {
                compute: function(t) {
                    for (var e = u(t), i = 0, r, a = 0; a < t.length; a++)
                        if (i += t[a], i >= this.kappa * e) {
                            r = a;
                            break
                        }
                    this.smoothWithLast && (r = (r + this.lastRolloffBin) / 2), this.lastRolloffBin = r, .001 > i && (r = 0);
                    var o = b(r, this.fftSize, this.sampleRate);
                    return console.log(o), o
                }
            }), Q = function(t) {
                E.apply(this, arguments), this.buffer = new r(t.bufferLength)
            }, Q.prototype = Object.create(E.prototype), Q.prototype.compute = function(t) {
                for (var e = u(t), i = 0, r, a = 0; a < t.length; a++)
                    if (i += t[a], i >= this.kappa * e) {
                        r = a;
                        break
                    }
                this.smoothWithLast && (r = (r + this.lastRolloffBin) / 2), this.lastRolloffBin = r, .001 > i && (r = 0);
                var o = b(r, this.fftSize, this.sampleRate);
                return this.buffer.shift(), this.buffer.push(o), M(this.buffer)
            }
        }.call(this),
        function() {
            D = function(t) {
                q = t.debug || !1;
                var e = this
            }, e.extend(D.prototype, {
                compute: function(t) {
                    for (var e = 0, i = 1; i < t.length; i++) t[i] * t[i - 1] < 0 && e++;
                    return e /= t.length - 1
                }
            }), U = function(t) {
                D.apply(this, arguments), this.buffer = new r(t.bufferLength)
            }, U.prototype = Object.create(D.prototype), U.prototype.compute = function(t) {
                for (var e = 0, i = 1; i < t.length; i++) t[i] * t[i - 1] < 0 && e++;
                e /= t.length - 1, this.buffer.shift(), this.buffer.push(e);
                var r = M(this.buffer);
                return r
            }
        }.call(this),
        function() {
            X = function(t) {
                this.sampleRate = t.sampleRate, this.zeropad = new Float32Array(4096)
            }, e.extend(X.prototype, {
                compute: function(t) {
                    var e = this.fastAutocorrelation(t),
                        i = this.findPeaks(e),
                        r = this.diff(i),
                        a = this.sampleRate / w(r);
                    return console.log("frequency: ", a), a
                },
                fastAutocorrelation: function(t) {
                    this.zeropad.set(t, 0);
                    var e = C.t(this.zeropad).fft(),
                        i = e.abs(),
                        r = C.mul(i.x, i.x),
                        a = C.t(r).ifft().x;
                    return a
                },
                slowAutocorrelation: function(t) {
                    var e = t.length,
                        i, r, a, o, s = new Float32Array(t.length);
                    for (a = 0; e > a; a++) {
                        for (r = 0, o = 0; e > o; o++) r += t[o] * (t[o + a] || 0);
                        0 === a && (i = r), s[a] = r / i
                    }
                    return s
                },
                findPeaks: function(t) {
                    for (var e = [0], i = 1; i < t.length - 1; i++) t[i] > 0 && t[i - 1] < t[i] && t[i] > t[i + 1] && e.push(i);
                    return e
                },
                diff: function(t) {
                    return t.reduce(function(e, i, r) {
                        return e[r] = t[r] - t[r - 1], e
                    }, []).slice(1)
                }
            })
        }.call(this), "undefined" == typeof Package && (Package = {}), Package.audiofeatures = {
            CFA: L,
            Chroma: x,
            ChromaVar: Z,
            ChromaDiffVar: H,
            ChromaRange: _,
            HFC: N,
            RMS: T,
            SpectralCentroid: V,
            SpectralCentroidVar: W,
            SpectralFlux: O,
            SpectralFluxVar: j,
            SpectralRolloff: E,
            SpectralRolloffVar: Q,
            ZeroCrossingRate: D,
            ZeroCrossingRateVar: U,
            Autocorrelation: X
        }
}();

! function() {
    var t = Package.meteor.Meteor,
        e = Package.session.Session,
        n = Package.underscore._,
        r = Package.tracker.Tracker,
        o = Package.tracker.Deps,
        i = Package.jquery.$,
        a = Package.jquery.jQuery,
        s = Package["reactive-dict"].ReactiveDict,
        c = Package["reactive-var"].ReactiveVar,
        u = Package["ephemer:reactive-array"].ReactiveArray,
        h = Package.ecmascript.ECMAScript,
        d = Package["flow-core"].flow,
        l = Package["flowkey:microphone"].Microphone,
        f = Package["flowkey:dsp"].DSP,
        p = Package["flowkey:dsp"].DFT,
        g = Package["flowkey:dsp"].FFT,
        m = Package["flowkey:dsp"].Oscillator,
        v = Package["flowkey:dsp"].ADSR,
        y = Package["flowkey:dsp"].IIRFilter,
        S = Package["flowkey:dsp"].MultiDelay,
        k = Package["flowkey:dsp"].WindowFunction,
        w = Package["flowkey:math-tools"].zArray,
        C = Package["flowkey:math-tools"].linearToDecibel,
        b = Package["flowkey:math-tools"].decibelToLinear,
        P = Package["flowkey:math-tools"].getRmsOfArray,
        A = Package["flowkey:math-tools"].getMaxOfArray,
        M = Package["flowkey:math-tools"].copyArray,
        I = Package["flowkey:math-tools"].getMinOfArray,
        B = Package["flowkey:math-tools"].getSumOfArray,
        D = Package["flowkey:math-tools"].getAbsSumOfArray,
        F = Package["flowkey:math-tools"].centToFrequencyRatio,
        L = Package["flowkey:math-tools"].frequencyRatioToCent,
        N = Package["flowkey:math-tools"].midiToFrequency,
        _ = Package["flowkey:math-tools"].frequencyToMidi,
        O = Package["flowkey:math-tools"].calculateBinFromFrequency,
        T = Package["flowkey:math-tools"].calculateFrequencyFromBin,
        x = Package["flowkey:math-tools"].getBin,
        E = Package["flowkey:math-tools"].flashsort,
        R = Package["flowkey:math-tools"].getFreq,
        j = Package["flowkey:math-tools"].mean,
        q = Package["flowkey:math-tools"].median,
        z = Package["flowkey:math-tools"].firstQuartile,
        G = Package["flowkey:math-tools"].thirdQuartile,
        V = Package["flowkey:math-tools"].interQuartileRange,
        W = Package["flowkey:math-tools"].variance,
        H = Package["flowkey:math-tools"].standardDeviation,
        U = Package["flowkey:math-tools"].createLinearSpace,
        Y = Package["flowkey:math-tools"].calculateMappingElementCountVector,
        Q = Package["mrt:underscore-string-latest"]._s,
        J = Package.audiofeatures.CFA,
        X = Package.audiofeatures.Chroma,
        Z = Package.audiofeatures.ChromaVar,
        $ = Package.audiofeatures.ChromaDiffVar,
        K = Package.audiofeatures.ChromaRange,
        tt = Package.audiofeatures.HFC,
        et = Package.audiofeatures.RMS,
        nt = Package.audiofeatures.SpectralCentroid,
        rt = Package.audiofeatures.SpectralCentroidVar,
        ot = Package.audiofeatures.SpectralFlux,
        it = Package.audiofeatures.SpectralFluxVar,
        at = Package.audiofeatures.SpectralRolloff,
        st = Package.audiofeatures.SpectralRolloffVar,
        ct = Package.audiofeatures.ZeroCrossingRate,
        ut = Package.audiofeatures.ZeroCrossingRateVar,
        ht = Package.audiofeatures.Autocorrelation,
        dt = Package["flowkey:settings-manager"].SettingsManager,
        lt = Package["flowkey:functionstack"].FunctionStack,
        ft = Package["babel-runtime"].babelHelpers,
        pt = Package["ecmascript-runtime"].Symbol,
        gt = Package["ecmascript-runtime"].Map,
        mt = Package["ecmascript-runtime"].Set,
        vt = Package.promise.Promise,
        yt, St, kt, wt, Ct, bt, Pt, At, Mt, It, Bt, Dt, Ft, Lt, Nt, _t, Ot, Tt;
    (function() {
        function e() {
            d.log(1, "[inputmanager-base.es6.js] Muted player succesfully")
        }

        function n() {
            d.log(1, "[inputmanager-base.es6.js] UnMuted player succesfully")
        }

        function r(t) {
            d.log(3, "[inputmanager-base.es6.js] something went wrong " + t)
        }
        yt = function() {
            function o() {
                var t = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0];
                ft.classCallCheck(this, o), this.inputStatus = new c("unloaded"), this.inputLevel = new c(0), this.activeInputs = new u, this.activeOutputs = new u
            }
            return o.prototype.start = function() {
                function t() {
                    "ready" === this.inputStatus.get() && this._start()
                }
                return t
            }(), o.prototype.stop = function() {
                function t() {
                    "ready" === this.inputStatus.get() && this._stop()
                }
                return t
            }(), o.prototype.loadSource = function() {
                function t() {
                    "ready" !== this.inputStatus.get() && this._loadSource()
                }
                return t
            }(), o.prototype.unloadSource = function() {
                function t() {
                    "unloaded" !== this.inputStatus.get() && this._unloadSource()
                }
                return t
            }(), o.prototype.muteiPad = function() {
                function n() {
                    t.isCordova && (d.version.number.get() < 1.1 ? cordova.exec(e, r, "PitchDetection", "mute") : cordova.exec(e, r, "VolumeControl", "mute"))
                }
                return n
            }(), o.prototype.unmuteiPad = function() {
                function e() {
                    t.isCordova && (d.version.number.get() < 1.1 ? cordova.exec(n, r, "PitchDetection", "unmute") : cordova.exec(n, r, "VolumeControl", "unmute"))
                }
                return e
            }(), o.prototype.get = function() {
                function t() {
                    return this
                }
                return t
            }(), o.prototype.reset = function() {
                function t() {
                    this.stop(), this.unloadSource()
                }
                return t
            }(), o.prototype._start = function() {
                function t() {
                    console.error("[InputManager] start() not implemented")
                }
                return t
            }(), o.prototype._stop = function() {
                function t() {
                    console.error("[InputManager] stop() not implemented")
                }
                return t
            }(), o.prototype._loadSource = function() {
                function t() {
                    console.error("[InputManager] loadSource() not implemented")
                }
                return t
            }(), o.prototype._unloadSource = function() {
                function t() {
                    console.error("[InputManager] unloadSource() not implemented")
                }
                return t
            }(), o
        }()
    }).call(this),
        function() {
            St = function(t) {
                function e(n) {
                    ft.classCallCheck(this, e), t.call(this, n = {})
                }
                return ft.inherits(e, t), e.prototype._loadSource = function() {
                    function t() {
                        console.error("[MidiManager] _loadSource() not implemented")
                    }
                    return t
                }(), e.prototype._unloadSource = function() {
                    function t() {
                        console.error("[MidiManager] _unloadSource() not implemented")
                    }
                    return t
                }(), e.prototype._start = function() {
                    function t() {
                        console.error("[MidiManager] _start() not implemented")
                    }
                    return t
                }(), e.prototype._stop = function() {
                    function t() {
                        console.error("[MidiManager] _stop() not implemented")
                    }
                    return t
                }(), e.prototype._midiMessageHandler = function() {
                    function t(t) {
                        d.log(1, "[MidiManager] got midimessage: ", t);
                        var e = 0,
                            n = void 0;
                        t.data.length > 2 && (e = t.data[2]);
                        var r = t.data[0] >> 4;
                        8 == r || 9 == r && 0 == e ? n = this._velocityToPercentage(0) : 9 == r && (n = this._velocityToPercentage(e)), n && (this.inputLevel.set(n), t.target && t.target.inputLevel && t.target.inputLevel.set(n)), d.events.trigger("midiMessage", t.data)
                    }
                    return t
                }(), e.prototype._velocityToPercentage = function() {
                    function t(t) {
                        var e = t / 127;
                        return Math.max(.1, e)
                    }
                    return t
                }(), e.prototype._onMidiFail = function() {
                    function t(t) {
                        d.log(3, "[MidiManager] Something went wrong! Error: " + t), Tt.inputStatus.set("rejected")
                    }
                    return t
                }(), e
            }(yt)
        }.call(this),
        function() {
            kt = function(t) {
                this.bufferSize = t.bufferSize || 2048, this.sampleRate = t.sampleRate, this.fft = new g(this.bufferSize, this.sampleRate)
            }, n.extend(kt.prototype, {
                compute: function(t) {
                    return this.fft.forward(t), this.fft.spectrum
                }
            })
        }.call(this),
        function() {
            wt = function(t) {
                this.context = t.audioContext, this.targetNode = t.fileSourceNode, this.urlList = t.audioFilePaths, this.onload = t.onload, this.bufferList = new Array, this.loadCount = 0
            }, wt.prototype.loadBuffer = function(t, e) {
                var r = new XMLHttpRequest,
                    o = n.words(t, "/");
                o[o.length - 1] = encodeURIComponent(o[o.length - 1]);
                var i = "/" + o.join("/");
                r.open("GET", i, !0), r.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), console.log(t), r.responseType = "arraybuffer";
                var a = this;
                r.onload = function() {
                    a.context.decodeAudioData(r.response, function(n) {
                        return n ? (a.bufferList[e] = n, void(++a.loadCount == a.urlList.length && a.onload({
                            bufferList: a.bufferList,
                            targetNode: a.targetNode
                        }))) : void alert("error decoding file data: " + t)
                    }, function(e) {
                        console.error("decodeAudioData error", e), console.log(t)
                    })
                }, r.onerror = function() {
                    alert("BufferLoader: XHR error")
                }, r.send()
            }, wt.prototype.load = function() {
                for (var t = 0; t < this.urlList.length; ++t) this.loadBuffer(this.urlList[t], t)
            }
        }.call(this),
        function() {
            Ct = function() {
                function t(t) {
                    var e = {};
                    return t && "[object Function]" === e.toString.call(t)
                }
                return t
            }()
        }.call(this),
        function() {
            bt = function(t) {
                this.nodes = {}, this.audioSources = {}, this.wam = t.webaudioManager, this.init()
            }, n.extend(bt.prototype, {
                init: function() {
                    this.addCustomNodes(), this.addNativeNodes(), this.createAllSources()
                },
                add: function(t, e) {
                    this.nodes[t] = new Pt(t, e, Ot)
                },
                clone: function(t, e, r) {
                    var o = this.nodes[t].definition;
                    n.each(r, function(t, e) {
                        o[e] = t
                    }), this.nodes[e] = new Pt(e, o, Ot)
                },
                get: function(t) {
                    return this.getSource(t) ? this.getSource(t) : this.nodes[t]
                },
                getNode: function(e) {
                    var n = this.nodes[e];
                    if (n.created) return this.nodes[e].instance;
                    throw new t.Error(891, "Error 891: You have to create the Node first before you can get it ;(")
                },
                create: function(t) {
                    var e = this;
                    if (!i.isArray(t)) {
                        var r = e.nodes[t];
                        return r.create()
                    }
                    var o = this.get(t);
                    n.each(o, function(t, n) {
                        var r = e.nodes[n];
                        r.create()
                    })
                },
                getSource: function(t) {
                    return this.audioSources[t]
                },
                createAudioSource: function(t, e) {
                    var n = this.audioSources[t] = new Lt(t, e, this.wam);
                    return n
                }
            })
        }.call(this),
        function() {
            function e() {
                var e = this,
                    o = e.definition,
                    i = e.settings,
                    a;
                if ("createScriptProcessor" == o.construct) {
                    var s = i.bufferSize || 0,
                        c = i.numberOfInputChannels || 2,
                        u = i.numberOfOutputChannels || 2;
                    a = Ot.createScriptProcessor(s, c, u), a.onaudioprocess = function(t) {
                        o.onProcess.apply(e, [t])
                    }
                } else try {
                    var h = [];
                    n.each(e.settings, function(t, e, n) {
                        h.push(t)
                    });
                    var d = Ot[o.construct];
                    a = d.apply(Ot, h), r(e.settings, a), e.webAudio = !0
                } catch (l) {
                    throw new t.Error(1, "A problem occured while creating node with " + o.construct + ": ", l)
                }
                return a
            }

            function r(t, e) {
                n.each(t, function(t, n, r) {
                    try {
                        var o = e[n];
                        "object" == typeof o ? e[n].value = t : e[n] = t
                    } catch (i) {
                        console.warn(i, n, t)
                    }
                })
            }
            Pt = function(t, e, r) {
                this.type = t;
                var o = ["construct", "connectTo", "required", "omit", "onProcess", "inject"];
                this.omitParameters = o.concat(e.omit || []), this.audioContext = r, this.injectFunctions = new lt, this.onProcess = e.onProcess, this.created = !1, this.instance = void 0, this.definition = e, this.required = e.required, this.settings = n.omit(e, this.omitParameters), this.graph = void 0, this.definition.inject && this.injectArray(this.definition.inject)
            }, n.extend(Pt.prototype, {
                change: function(t) {
                    var e = this;
                    n.each(t, function(t, n, r) {
                        var o;
                        "inject" === n && e.injectArray(t), o = e.getLocalResult(t), e.settings[n] = o
                    }), e.webAudio && e.instance && r(t, e.instance)
                },
                checkManipulation: function(t) {
                    var e = this,
                        r = !1;
                    return n.each(t, function(t, n, o) {
                        var i;
                        i = e.getLocalResult(t), void 0 !== e.settings[n] && e.created === !0 && e.settings[n] !== i && (r = !0)
                    }), r
                },
                create: function() {
                    var r = this;
                    this.required && this.required.length > 0 && n.each(r.required, function(e) {
                        if (void 0 === r.settings[e]) throw new t.Error(891, "Error 891: You have tryed to create a node:  " + r.type + "  - that is missing the following required value: " + e)
                    });
                    var o = e.apply(this, [this.settings]);
                    return this.created = !0, this.instance = o, o
                },
                inject: function(t) {
                    this.injectFunctions.add(t)
                },
                injectArray: function(t) {
                    var e = this;
                    i.isArray(t) ? n.each(t, function(t) {
                        e.inject(t)
                    }) : e.inject(t)
                },
                runInject: function(t) {
                    this.injectFunctions.runAll(t)
                },
                getSettings: function(t, e) {
                    return void 0 !== this.graph.nodeSpec[t] ? this.graph.nodeSpec[t].settings[e] : this.graph.graphSpec[t][e]
                },
                getSettingsResult: function() {
                    var t = this,
                        e = n.keys(this.settings),
                        r = {};
                    return n.each(e, function(e) {
                        var n;
                        r[e] = t.getLocalResult(t.settings[e])
                    }), r
                },
                getLocalResult: function(t) {
                    var e, n = this;
                    return e = Ct(t) ? t.apply(n) : t
                }
            })
        }.call(this),
        function() {
            At = function(t) {
                Mt = this, navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia, navigator.getUserMedia({
                    audio: !0
                }, function(e) {
                    var n = t.audioContext.createMediaStreamSource(e);
                    t.nodeLibrary.getSource("html5mic").setAudioSourceNode(n), d.log(1, "Mic Access Granted"), d.audioManager.inputStatus.set("ready")
                }, function() {
                    d.log(2, "Mic Access Failed")
                })
            }
        }.call(this),
        function() {
            It = function(t) {
                var e = this;
                this.injectStart(function() {
                    e.bufferLoader = new Nt({
                        settings: e.settings,
                        audioContext: t.audioContext,
                        targetNode: n
                    })
                });
                var n = t.audioContext.createScriptProcessor(e.blockLength, 1, 1);
                n.onaudioprocess = function(t) {
                    var e = t.inputBuffer.getChannelData(0),
                        n = t.outputBuffer.getChannelData(0);
                    n.set(e)
                }, this.setAudioSourceNode(n)
            }
        }.call(this),
        function() {
            function t(t, e) {
                t.microphone.audioResource.mediaStream && e.activeInputs.push(t.microphone.audioResource.mediaStream.getAudioTracks()[0])
            }
            Bt = function(e) {
                var n = this,
                    r = d.audioManager.inputStatus;
                n.microphone = new l({
                    audioContext: e.audioContext,
                    onSuccess: function(o) {
                        var i = n.microphone.intermediateNode;
                        e.nodeLibrary.getSource("microphone").setAudioSourceNode(i), d.log(1, "[WebAudioManager] Mic Access Granted"), r.set("ready"), t(n, e), d.events.trigger("MIC_READY")
                    },
                    onReject: function() {
                        d.log(2, "[WebAudioManager] Mic Access Failed"), r.set("rejected"), d.events.trigger("MIC_REJECTED")
                    },
                    onNoSignal: function() {
                        d.log(2, "[WebAudioManager] Mic No Signal"), r.set("noSignal"), d.events.trigger("MIC_NOSIGNAL")
                    },
                    onNoSource: function() {
                        r.set("noSource"), d.events.trigger("MIC_NOSOURCE")
                    },
                    onAudioData: d.bind(e.onAudioData, e)
                })
            }
        }.call(this),
        function() {
            Dt = function(t) {
                var e = this;
                this.injectStart(function() {
                    n.frequency.value = e.settings.frequency, n.start(0)
                });
                var n = t.audioContext.createOscillator();
                this.setAudioSourceNode(n)
            }
        }.call(this),
        function() {
            Ft = function(t) {
                var e = this;
                this.injectStart(function() {
                    o.mediaElement.play(), d.events.dispatchEvent(d.events.create("sourceStart"))
                });
                var n;
                try {
                    n = document.getElementById("video"), console.warn("todo: remove hard code")
                } catch (r) {
                    console.error("could not find video element ", r)
                }
                var o = t.audioContext.createMediaElementSource(n);
                this.setAudioSourceNode(o)
            }
        }.call(this),
        function() {
            Lt = function(t, e, n) {
                var r = this;
                this.sourceCreator = e, this.dep = new o.Dependency, this.graphs = [], this.started = !1, this.inited = !1, this.canceled = !1, this.node = void 0, this.settings = {}, this.wam = n, this.startCallbacks = new lt
            }, n.extend(Lt.prototype, {
                init: function(t) {
                    var e = this;
                    return this.inited === !1 && (this.sourceCreator(e.wam), t && o.autorun(function() {
                        e.updateAudioSource(name)
                    })), this.inited = !0, this.microphone && this.canceled ? (this.canceled = !1, this.microphone.start()) : void 0
                },
                start: function() {
                    var t = this;
                    return this.inited === !1 && this.init(!0), this.node ? (this.started = !0, this.startCallbacks.runAll(arguments), void this.connectGraphs()) : void 0
                },
                cancel: function() {
                    this.microphone && (this.canceled = !0, this.microphone.stop())
                },
                _stop: function() {
                    try {
                        this.node.disconnect(), this.started = !1, this.stopCallback && this.stopCallback()
                    } catch (t) {
                        console.warn(t)
                    }
                },
                stop: function(t) {
                    n.isFunction(t) && (this.stopCallback = t)
                },
                injectStart: function(t) {
                    this.startCallbacks.add(t)
                },
                updateAudioSource: function(t) {
                    var e = this;
                    this.dep.depend(), this.node && this.connectGraphs()
                },
                connectGraphs: function() {
                    n.each(this.graphs, function(t, e) {
                        t.started && (d.log(1, "connecting source to graph " + t.name + " " + t.started), t.connectNodes())
                    })
                },
                setAudioSourceNode: function(t) {
                    var e = this;
                    this.node = t, this.dep.changed()
                }
            })
        }.call(this),
        function() {
            var t, e, r, o, i, a;
            n.extend(bt.prototype, {
                createAllSources: function() {
                    o = this.createAudioSource("microphone", Bt), t = this.createAudioSource("fileSource", It), t.stop(function() {
                        this.bufferLoader && (this.bufferLoader = void 0)
                    }), e = this.createAudioSource("html5mic", At), r = this.createAudioSource("oscillator", Dt), i = this.createAudioSource("mediaElement", Ft)
                }
            }), Nt = function(t) {
                var e = this;
                this.audioContext = t.audioContext, this.targetNode = t.targetNode, this.preSources, this.preSourceIndex = 0, this.signalStartTime, this.onStart = t.settings.onStart, this.BufferFileEndEvent = d.events.create("BufferFileEnd"), this.BufferFileStartEvent = d.events.create("BufferFileStart"), this.BufferSourceEnded = d.events.create("BufferSourceEnded"), this.onBufferSourceEnded = t.settings.onBufferSourceEnded, this.eventData = t.settings.eventData;
                var n = t.settings.fileNames,
                    r = t.settings.filePath;
                this.eventData && this.eventData.length !== n.length && alert("Number of Events and Audiofiles are not matching");
                for (var o = new Array(n.length), i = 0; i < o.length; i++) o[i] = r + n[i];
                var a = d.bind(e.setPreSources, e),
                    s = new wt({
                        audioContext: this.audioContext,
                        fileSourceNode: this.targetNode,
                        audioFilePaths: o,
                        onload: a
                    });
                s.load()
            }, n.extend(Nt.prototype, {
                setPreSources: function(e) {
                    var r = this,
                        o = e.bufferList,
                        i = e.targetNode;
                    r.preSources = new Array(o.length);
                    for (var a = 0; a < r.preSources.length; a++) r.preSources[a] = this.audioContext.createBufferSource(), r.preSources[a].buffer = o[a], r.preSources[a].connect(i), r.preSources[a].onended = function(e) {
                        if (n.isFunction(t.settings.onEnded) && t.settings.onEnded(), d.events.dispatchEvent(r.BufferFileEndEvent), r.preSourceIndex++, r.preSourceIndex < r.preSources.length) r.eventData && (r.BufferFileStartEvent.data = r.eventData[r.preSourceIndex], d.events.dispatchEvent(r.BufferFileStartEvent)), r.preSources[r.preSourceIndex].start(0), logMsg("playing preSource " + r.preSourceIndex);
                        else {
                            d.events.dispatchEvent(r.BufferSourceEnded);
                            try {
                                r.onBufferSourceEnded()
                            } catch (o) {
                                console.warn(o)
                            }
                        }
                    };
                    n.isFunction(this.onStart) && this.onStart(), r.eventData && (d.events.dispatchEvent(d.events.create("sourceStart")), r.BufferFileStartEvent.data = r.eventData[r.preSourceIndex], d.events.dispatchEvent(r.BufferFileStartEvent)), r.preSources[0].start(0), logMsg("playing preSource " + r.preSourceIndex)
                },
                startFirstPreSource: function() {
                    this.preSources[0].start(0), this.signalStartTime = window.performance.now()
                }
            })
        }.call(this),
        function() {
            n.extend(bt.prototype, {
                addCustomNodes: function() {
                    this.add("chromaExtractor", {
                        construct: "createScriptProcessor",
                        required: ["bufferSize", "numberOfInputChannels", "numberOfOutputChannels"],
                        chromaVector: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        onProcess: function(t) {
                            for (var e = t.inputBuffer, n = t.outputBuffer, r = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], o = e.numberOfChannels - 1; o >= 0; o--) {
                                var i = e.getChannelData(o);
                                r[o % 12] += P(i)
                            }
                            this.runInject(r), this.settings.chromaVector = r.slice();
                            for (var o = t.inputBuffer.numberOfChannels - 1; o >= 0; o--) {
                                var a = t.inputBuffer.getChannelData(o),
                                    s = t.outputBuffer.getChannelData(o);
                                s.set(a)
                            }
                        }
                    }), this.add("magnitudeMeter", {
                        construct: "createScriptProcessor",
                        required: ["bufferSize", "numberOfInputChannels", "numberOfOutputChannels"],
                        onProcess: function(t) {
                            for (var e = t.inputBuffer, n = t.outputBuffer, r = [], o = e.numberOfChannels - 1; o >= 0; o--) {
                                var i = e.getChannelData(o),
                                    a = D(i);
                                r.push(a)
                            }
                            this.runInject(r);
                            for (var o = t.inputBuffer.numberOfChannels - 1; o >= 0; o--) {
                                var s = t.inputBuffer.getChannelData(o),
                                    c = t.outputBuffer.getChannelData(o);
                                c.set(s)
                            }
                        }
                    }), this.add("coAnalyser", {
                        construct: "createScriptProcessor",
                        required: ["analyserNodeName", "bufferSize", "sampleRate"],
                        bufferSize: 2048,
                        numberOfInputChannels: 1,
                        numberOfOutputChannels: 1,
                        init: !1,
                        onProcess: function(t) {
                            this.settings.init || (this.analyserNode = this.graph.nodes[this.settings.analyserNodeName], this.settings.init = !0);
                            var e = new Float32Array(this.analyserNode.frequencyBinCount);
                            this.analyserNode.getFloatFrequencyData(e);
                            for (var n = e.length; n--;) e[n] = b(e[n]);
                            this.runInject(e);
                            for (var r = t.inputBuffer.numberOfChannels - 1; r >= 0; r--) {
                                var o = t.inputBuffer.getChannelData(r),
                                    i = t.outputBuffer.getChannelData(r);
                                i.set(o)
                            }
                        }
                    }), this.add("fft", {
                        construct: "createScriptProcessor",
                        numberOfInputChannels: 1,
                        numberOfOutputChannels: 1,
                        test: 2,
                        required: ["bufferSize", "sampleRate"],
                        omit: [],
                        onProcess: function(t) {
                            var e = t.inputBuffer.getChannelData(0);
                            this.fft || (this.fft = new kt({
                                sampleRate: this.sampleRate
                            }));
                            var n = this.fft.compute(e);
                            this.runInject(n);
                            for (var r = t.inputBuffer.numberOfChannels - 1; r >= 0; r--) {
                                var o = t.inputBuffer.getChannelData(r),
                                    i = t.outputBuffer.getChannelData(r);
                                i.set(o)
                            }
                        }
                    }), this.add("gate", {
                        construct: "createScriptProcessor",
                        required: ["bufferSize", "sampleRate", "threshold", "attackTime", "releaseTime", "holdTime", "range"],
                        numberOfInputChannels: 1,
                        numberOfOutputChannels: 1,
                        bufferSize: 2048,
                        threshold: .0025,
                        attackTime: 50,
                        releaseTime: 100,
                        holdTime: 50,
                        range: .5,
                        state: 1,
                        holdCount: 0,
                        gate: 0,
                        aRate: 0,
                        rRate: 0,
                        init: !1,
                        onProcess: function(t) {
                            this.settings.init || (this.settings.aRate = 1e3 / (this.settings.attackTime * this.settings.sampleRate), this.settings.rRate = 1e3 / (this.settings.releaseTime * this.settings.sampleRate), this.settings.init = !0);
                            for (var e = t.inputBuffer.getChannelData(0), n = new Float32Array(this.settings.bufferSize), r = e.length - 1; r >= 0; r--) {
                                var o = e[r];
                                switch (this.settings.state) {
                                    case 0:
                                        Math.abs(o) >= this.settings.threshold && (this.settings.state = 1);
                                        break;
                                    case 1:
                                        this.settings.gate += this.settings.aRate, this.settings.gate >= 1 && (this.settings.state = 2, this.settings.holdCount = Math.round(this.settings.holdTime * this.settings.sampleRate * .001));
                                        break;
                                    case 2:
                                        this.settings.holdCount <= 0 ? Math.abs(o) < this.settings.threshold && (this.settings.state = 3) : this.settings.holdCount--;
                                        break;
                                    case 3:
                                        this.settings.gate -= this.settings.rRate, Math.abs(o) >= this.settings.threshold ? this.settings.state = 1 : this.settings.gate <= 0 && (this.settings.gate = 0, this.settings.state = 0);
                                        break;
                                    default:
                                        console.error("gate node is in unkown state")
                                }
                                n[r] = o * this.settings.gate
                            }
                            this.runInject(n);
                            var i = t.outputBuffer.getChannelData(0);
                            i.set(n)
                        }
                    }), this.add("passThrough", {
                        construct: "createScriptProcessor",
                        numberOfInputChannels: 1,
                        numberOfOutputChannels: 1,
                        onProcess: function(t) {
                            var e = t.inputBuffer.getChannelData(0);
                            this.runInject(e);
                            var n = t.outputBuffer.getChannelData(0);
                            n.set(e)
                        }
                    }), this.add("downsample", {
                        construct: "createScriptProcessor",
                        numberOfInputChannels: 1,
                        numberOfOutputChannels: 1,
                        required: ["bufferSize", "downsampleFactor"],
                        onProcess: function(t) {
                            var e = t.inputBuffer.getChannelData(0);
                            this.downsampledTimeBlock || (this.downsampledTimeBlock = new Float32Array(Math.round(this.settings.bufferSize / this.settings.downsampleFactor)));
                            for (var n = 0; n < this.downsampledTimeBlock.length; n++) this.downsampledTimeBlock[n] = e[n * this.settings.downsampleFactor];
                            this.runInject(this.downsampledTimeBlock);
                            var r = t.outputBuffer.getChannelData(0);
                            r.set(this.downsampledTimeBlock)
                        }
                    }), this.add("overlap", {
                        construct: "createScriptProcessor",
                        required: ["bufferSize", "downsampleFactor"],
                        init: !1,
                        numberOfInputChannels: 1,
                        numberOfOutputChannels: 1,
                        onProcess: function(t) {
                            var e = t.inputBuffer.getChannelData(0);
                            this.settings.init || (this.settings.overlapArray = new Float32Array(this.settings.bufferSize), this.settings.partBlockLength = Math.round(this.settings.bufferSize / this.settings.downsampleFactor), this.settings.targetPosition = (this.settings.downsampleFactor - 1) * this.settings.partBlockLength, this.settings.init = !0);
                            for (var n = 0; n < this.settings.downsampleFactor - 1; n++) {
                                var r = n * this.settings.partBlockLength,
                                    o = this.settings.overlapArray.subarray((n + 1) * this.settings.partBlockLength, (n + 3) * this.settings.partBlockLength);
                                this.settings.overlapArray.set(o, r)
                            }
                            this.settings.overlapArray.set(e.subarray(0, this.settings.partBlockLength), this.settings.targetPosition), this.runInject(this.settings.overlapArray);
                            var i = t.outputBuffer.getChannelData(0);
                            i.set(this.settings.overlapArray)
                        }
                    }), this.add("downsampleAndOverlap", {
                        construct: "createScriptProcessor",
                        required: ["bufferSize", "downsampleFactor"],
                        init: !1,
                        numberOfInputChannels: 1,
                        numberOfOutputChannels: 1,
                        onProcess: function(t) {
                            var e = t.inputBuffer.getChannelData(0);
                            this.settings.init || (this.downsampledTimeBlock = new Float32Array(Math.round(this.settings.bufferSize / this.settings.downsampleFactor)), this.settings.overlapArray = new Float32Array(this.settings.bufferSize), this.settings.partBlockLength = Math.round(this.settings.bufferSize / this.settings.downsampleFactor), this.settings.targetPosition = (this.settings.downsampleFactor - 1) * this.settings.partBlockLength, this.settings.init = !0);
                            for (var n = 0; n < this.downsampledTimeBlock.length; n++) this.downsampledTimeBlock[n] = e[n * this.settings.downsampleFactor];
                            for (var n = 0; n < this.settings.downsampleFactor - 1; n++) {
                                var r = n * this.settings.partBlockLength,
                                    o = this.settings.overlapArray.subarray((n + 1) * this.settings.partBlockLength, (n + 3) * this.settings.partBlockLength);
                                this.settings.overlapArray.set(o, r)
                            }
                            this.settings.overlapArray.set(this.downsampledTimeBlock.subarray(0, this.settings.partBlockLength), this.settings.targetPosition), this.runInject(this.settings.overlapArray);
                            var i = t.outputBuffer.getChannelData(0);
                            i.set(this.settings.overlapArray)
                        }
                    }), this.add("hanningWindow", {
                        construct: "createScriptProcessor",
                        required: ["bufferSize"],
                        bufferSize: 2048,
                        numberOfInputChannels: 1,
                        numberOfOutputChannels: 1,
                        onProcess: function(t) {
                            for (var e = t.inputBuffer.getChannelData(0), n = new Float32Array(this.settings.bufferSize), r = this.settings.bufferSize - 1; r >= 0; r--) n[r] = e[r] * k.Hann(this.settings.bufferSize, r);
                            this.runInject(n);
                            var o = t.outputBuffer.getChannelData(0);
                            o.set(n)
                        }
                    })
                }
            })
        }.call(this),
        function() {
            n.extend(bt.prototype, {
                addNativeNodes: function() {
                    this.add("filter", {
                        construct: "createBiquadFilter"
                    }), this.add("gain", {
                        construct: "createGain"
                    }), this.add("analyser", {
                        construct: "createAnalyser"
                    }), this.add("delay", {
                        construct: "createDelay"
                    }), this.add("waveShaper", {
                        construct: "createWaveShaper"
                    }), this.add("panner", {
                        construct: "createPanner"
                    }), this.add("convolver", {
                        construct: "createConvolver"
                    }), this.add("compressor", {
                        construct: "createDynamicsCompressor"
                    }), this.add("mediaStreamDestination", {
                        construct: "createMediaStreamDestination"
                    }), this.add("periodicWave", {
                        construct: "createPeriodicWave",
                        required: ["real", "imag"]
                    }), this.add("compressor", {
                        construct: "createDynamicsCompressor"
                    }), this.add("channelSplitter", {
                        construct: "createChannelSplitter"
                    }), this.add("channelMerger", {
                        construct: "createChannelMerger"
                    })
                }
            })
        }.call(this),
        function() {
            _t = function(t, e, r) {
                var o = this,
                    t = this.name = t;
                return this.manager = r, this.graphSpec = e, this.nodeOrder, this.nodes = {}, this.nodeSpec = {}, this.audioContext = r.audioContext, this.connected = !1, this.started = !1, this.createNodes(), o.nodeOrder = n.keys(o.graphSpec), o
            }, n.extend(_t.prototype, {
                start: function() {
                    d.log(1, "[AudioGraph] starting" + this.name), this.started = !0, this.source && this.source.started !== !0 ? this.source.start() : this.connected || this.connectNodes()
                },
                startSource: function(t) {
                    this.source.init(t)
                },
                cancelSource: function() {
                    this.source.cancel()
                },
                getNode: function(t) {
                    return this.getNodeSpec(t).instance || this.getNodeSpec(t).node
                },
                getNodeSpec: function(t) {
                    function e() {
                        return o.manager.nodeLibrary.getSource(t) ? i = o.source : void 0
                    }

                    function n() {
                        return o.nodes[t + o.name] ? i = o.nodeSpec[t + o.name] : !1
                    }

                    function r() {
                        return o.nodes[t + "changed"] ? i = o.nodeSpec[t + "changed "] : !1
                    }
                    var o = this,
                        i;
                    return i = o.nodeSpec[t], i = e() || i, i = n() || i, i = r() || i
                },
                change: function(t, e) {
                    var r = this;
                    n.each(e, function(t, e) {
                        try {
                            var n = r.getNodeSpec(e);
                            r.processNodeChange(t, e) || r.manager.nodeLibrary.get(e).change(t)
                        } catch (o) {
                            console.error(o)
                        }
                    })
                },
                processNodeChange: function(t, e) {
                    var r = this;
                    if (t.change) {
                        var o = t.change,
                            i = e + "changed",
                            a = n.omit(t, ["change"]);
                        if (r.manager.nodeLibrary.getSource(e)) {
                            r.manager.nodeLibrary.getSource(e).graphs.splice(0, 1), r.source = r.manager.nodeLibrary.getSource(o);
                            var s = !1;
                            n.each(r.source.graphs, function(t) {
                                t === r && (s = !0)
                            }), s || r.source.graphs.push(r), r.source.settings = a
                        } else r.manager.nodeLibrary.clone(o, i, a);
                        return !0
                    }
                    return !1
                },
                createNodes: function() {
                    var t = this;
                    n.each(t.graphSpec, function(e, n, r) {
                        var o;
                        if (t.manager.nodeLibrary.getSource(n)) t.source = t.manager.nodeLibrary.getSource(n), t.manager.nodeLibrary.getSource(n).graphs.push(t), t.source.settings = e;
                        else {
                            var i = t.manager.nodeLibrary.get(n);
                            i.graph = t;
                            var a = t.manager.nodeLibrary.get(n).checkManipulation(e);
                            a ? (d.log(2, "Hey Take care you have changed a value of the following Node: " + n + " Maybe you intended to use the same value?"), o = n + t.name, t.manager.nodeLibrary.clone(n, o, e)) : (t.manager.nodeLibrary.get(n).change(e), o = n);
                            var s = t.manager.nodeLibrary.create(o);
                            t.nodes[o] = s, t.nodeSpec[o] = t.manager.nodeLibrary.get(o)
                        }
                    })
                },
                connectNodes: function() {
                    if (!this.connected) {
                        var t = this;
                        n.each(t.graphSpec, function(e, r, o) {
                            var i;
                            if (i = t.getNode(r), e.connectTo)
                                for (var a = e.connectTo.length - 1; a >= 0; a--) {
                                    var s = e.connectTo[a].node,
                                        c = e.connectTo[a].output,
                                        u = e.connectTo[a].input;
                                    "audioContext.destination" == s || "audiocontext.destination" == s || "destination" == s ? t.safeConnect(i, t.audioContext.destination, c, u) : t.safeConnect(i, t.getNode(s), c, u)
                                } else {
                                    var h = n.indexOf(t.nodeOrder, r),
                                        d = h + 1,
                                        l, s = t.nodeOrder[d];
                                    l = s ? t.getNode(s) : t.audioContext.destination, t.safeConnect(i, l)
                                }
                        }), this.connected = !0
                    }
                },
                safeConnect: function(t, e, n, r) {
                    try {
                        t.connect(e, n, r)
                    } catch (o) {
                        console.error("could not connect from node " + t, " to node " + e + " in ", this.graphSpec, " | " + o)
                    }
                },
                disconnectNodes: function() {
                    var t = this;
                    t.source._stop(), n.each(t.nodes, function(t, e, n) {
                        t.disconnect()
                    }), this.connected = !1
                },
                "delete": function() {
                    var t = this;
                    this.disconnectNodes(), n.each(this.source.graphs, function(e, n) {
                        e === t && delete t.source.graphs[n]
                    }), delete t
                }
            })
        }.call(this),
        function() {
            var t = function(t) {
                function e() {
                    var n = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0];
                    ft.classCallCheck(this, e), t.call(this), this.midiAccess = void 0
                }
                return ft.inherits(e, t), e.prototype.get = function() {
                    function t() {
                        return this
                    }
                    return t
                }(), e.prototype._start = function() {
                    function t() {}
                    return t
                }(), e.prototype._stop = function() {
                    function t() {
                        this._closeInputPorts()
                    }
                    return t
                }(), e.prototype._loadSource = function() {
                    function t() {
                        this.midiAccess || this._requestMidiAccess()
                    }
                    return t
                }(), e.prototype._unloadSource = function() {
                    function t() {
                        this._closeInputPorts(), this.inputStatus.set("unloaded")
                    }
                    return t
                }(), e.prototype._requestMidiAccess = function() {
                    function t() {
                        var t = this;
                        void 0 !== navigator.requestMIDIAccess ? (this.inputStatus.set("loading"), t.midiPromise = navigator.requestMIDIAccess(), t.midiPromise.then(d.bind(t._onMidiRequestSuccess, t), d.bind(t._onMidiFail, t))) : (d.log(3, "No access to MIDI devices: browser does not support WebMIDI API, please install the Jazz plugin"), this.inputStatus.set("rejected"))
                    }
                    return t
                }(), e.prototype._onMidiRequestSuccess = function() {
                    function t(t) {
                        this.midiAccess = t, this.midiAccess.onstatechange = d.bind(this._onstatechangeHandler, this), this._updateActiveInputs(), d.events.trigger("MIDI_SUCCESS")
                    }
                    return t
                }(), e.prototype._onMidiFail = function() {
                    function t(t) {
                        d.log(3, "MIDI FAILED! Something went wrong! Error: " + t), this.inputStatus.set("rejected"), d.events.trigger("MIDI_REJECTED")
                    }
                    return t
                }(), e.prototype._updateActiveInputs = function() {
                    function t() {
                        var t = this;
                        this.activeInputs.curValue.length = 0, this.midiAccess.inputs.forEach(function(e) {
                            e.inputLevel || (e.inputLevel = new c(0)), e.onmidimessage || (e.onmidimessage = d.bind(t._midiMessageHandler, t)), t.activeInputs.push(e)
                        }), this.midiAccess.inputs.size > 0 ? (this.inputStatus.set("ready"), d.events.trigger("MIDI_READY")) : (this.inputStatus.set("noSource"), d.events.trigger("MIDI_NOSOURCE")), this.activeInputs.dep.changed()
                    }
                    return t
                }(), e.prototype._closeInputPorts = function() {
                    function t() {
                        this.midiAccess && this.midiAccess.inputs.forEach(function(t) {
                            t.close()
                        })
                    }
                    return t
                }(), e.prototype._velocityToPercentage = function() {
                    function t(t) {
                        var e = t / 127;
                        return Math.max(.1, e)
                    }
                    return t
                }(), e.prototype._onstatechangeHandler = function() {
                    function t(t) {
                        var e = this,
                            n = t.port;
                        this._handleStateOf(n), this._handleConnectionOf(n), setTimeout(function() {
                            e._updateActiveInputs()
                        }, 0)
                    }
                    return t
                }(), e.prototype._handleConnectionOf = function() {
                    function t(t) {
                        "open" === t.connection ? d.log(1, "[WebmidiManager] midi port is open ", t) : "closed" === t.connection && d.log(1, "[WebmidiManager] Midi Port is closed", t)
                    }
                    return t
                }(), e.prototype._handleStateOf = function() {
                    function t(t) {
                        "disconnected" === t.state ? t.close() : "connected" === t.state ? "input" === t.type && t.open() : d.log(2, "not handled port.state: " + t.state)
                    }
                    return t
                }(), e
            }(St);
            d.midiManager = new t
        }.call(this),
        function() {
            Ot = void 0;
            var t = function(t) {
                function e() {
                    var n = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0];
                    ft.classCallCheck(this, e), t.call(this, n), this.audioGraphs = {};
                    try {
                        if (window.AudioContext = window.AudioContext || window.webkitAudioContext, void 0 === window.AudioContext) return void console.error("Your browser doesnt seem to support Web Audio.");
                        Ot = this.audioContext = new AudioContext, this.settings = new dt({
                            name: "settings",
                            init: {
                                blockLength: n.blockLength || 2048,
                                sampleRate: this.audioContext.sampleRate
                            }
                        })
                    } catch (r) {
                        console.error(r)
                    }
                    this.nodeLibrary = new bt({
                        webaudioManager: this
                    })
                }
                return ft.inherits(e, t), e.prototype.onAudioData = function() {
                    function t(t) {
                        var e = C(P(t));
                        this.inputLevel.set(this._volumeToPercentage(e))
                    }
                    return t
                }(), e.prototype._volumeToPercentage = function() {
                    function t(t) {
                        var e = 1 - t / -72;
                        return Math.max(.1, e)
                    }
                    return t
                }(), e.prototype.get = function() {
                    function t() {
                        return this
                    }
                    return t
                }(), e.prototype._start = function() {
                    function t() {
                        n.each(this.audioGraphs, function(t, e, n) {
                            t.start()
                        })
                    }
                    return t
                }(), e.prototype._stop = function() {
                    function t() {
                        var t = this;
                        n.each(t.audioGraphs, function(t, e, n) {
                            t.disconnectNodes()
                        })
                    }
                    return t
                }(), e.prototype._loadSource = function() {
                    function t() {
                        this.inputStatus.set("loading"), n.each(this.audioGraphs, function(t, e, n) {
                            var r = !1;
                            t.startSource(r)
                        })
                    }
                    return t
                }(), e.prototype._unloadSource = function() {
                    function t() {
                        n.each(this.audioGraphs, function(t, e, n) {
                            t.cancelSource()
                        }), this.inputStatus.set("unloaded")
                    }
                    return t
                }(), e.prototype.getSources = function() {
                    function t() {
                        var t = [];
                        return n.each(this.audioGraphs, function(e, r, o) {
                            n.contains(t, e.source) || t.push(e.source)
                        }), t
                    }
                    return t
                }(), e.prototype.createAudioGraph = function() {
                    function t(t, e) {
                        var n = this;
                        try {
                            return n.audioGraphs[t] = new _t(t, e, n), n.audioGraphs[t];

                        } catch (r) {
                            console.error(r)
                        }
                    }
                    return t
                }(), e.prototype.getAudioGraph = function() {
                    function t(t) {
                        if (this.audioGraphs[t]) return this.audioGraphs[t];
                        throw new Error("No Graph with the name: " + t + " found")
                    }
                    return t
                }(), e.prototype.changeAudioGraph = function() {
                    function t(t, e) {
                        var n = this;
                        try {
                            var r = n.audioGraphs[t];
                            r.change(t, e)
                        } catch (o) {
                            console.error(o, t, e)
                        }
                    }
                    return t
                }(), e.prototype.audioSourceStart = function() {
                    function t() {
                        this.settings.set("sampleRate", this)
                    }
                    return t
                }(), e.prototype.startGraphs = function() {
                    function t() {
                        var t = this;
                        n.each(t.audioGraphs, function(t, e, n) {
                            t.connectNodes()
                        })
                    }
                    return t
                }(), e
            }(yt);
            d.audioManager = new t
        }.call(this),
        function() {
            var e = function() {
                function e() {
                    var n = this;
                    ft.classCallCheck(this, e), this.inputType = new c, this.currentInputManager = new c, t.startup(function() {
                        n.setInputType("audio")
                    }), this.inputStatus = {
                        get: function() {
                            console.error("Deprecated - please read either midi oder audi input, to get the current input status for either one use: flow.inputManager.getCurrentInputStatus()")
                        },
                        set: function() {
                            console.error("Deprecated - please modify either midi oder audi input")
                        }
                    }, r.autorun(function() {
                        var t = n.autoSelectInput();
                        d.log(1, "Auto Selecting Input Type: " + t), n.setInputType(t)
                    }), d.events.listen("midiMessage", function() {
                        n.setInputType("midi")
                    })
                }
                return e.prototype.getCurrentInputStatus = function() {
                    function t() {
                        var t = this.inputType.get(),
                            e = this.currentInputManager.get();
                        return e.inputStatus.get()
                    }
                    return t
                }(), e.prototype.getCurrentInputLevel = function() {
                    function t() {
                        var t = this.inputType.get(),
                            e = this.currentInputManager.get();
                        return e.inputLevel.get()
                    }
                    return t
                }(), e.prototype.setInputType = function() {
                    function e(e) {
                        if (!e) throw new t.Error(300, "No InputType specidifed");
                        "mic" === e && (e = "audio"), this.inputType.curValue !== e && ("midi" === e && this.currentInputManager.set(d.midiManager), "audio" === e && this.currentInputManager.set(d.audioManager), this.inputType.set(e))
                    }
                    return e
                }(), e.prototype.autoSelectInput = function() {
                    function t() {
                        var t = d.midiManager.inputStatus.get();
                        return "ready" === t ? "midi" : "audio"
                    }
                    return t
                }(), e
            }();
            Tt = d.inputManager = new e
        }.call(this), "undefined" == typeof Package && (Package = {}), Package["webaudio-manager"] = {}
}();

! function() {
    var e = Package.meteor.Meteor,
        t = Package["flow-core"].flow,
        a = Package.audiofeatures.CFA,
        o = Package.audiofeatures.Chroma,
        n = Package.audiofeatures.ChromaVar,
        r = Package.audiofeatures.ChromaDiffVar,
        i = Package.audiofeatures.ChromaRange,
        s = Package.audiofeatures.HFC,
        c = Package.audiofeatures.RMS,
        l = Package.audiofeatures.SpectralCentroid,
        u = Package.audiofeatures.SpectralCentroidVar,
        h = Package.audiofeatures.SpectralFlux,
        d = Package.audiofeatures.SpectralFluxVar,
        m = Package.audiofeatures.SpectralRolloff,
        f = Package.audiofeatures.SpectralRolloffVar,
        p = Package.audiofeatures.ZeroCrossingRate,
        g = Package.audiofeatures.ZeroCrossingRateVar,
        k = Package.audiofeatures.Autocorrelation,
        y = Package["flowkey:numeric"].numeric,
        w = Package["flowkey:math-tools"].zArray,
        v = Package["flowkey:math-tools"].linearToDecibel,
        P = Package["flowkey:math-tools"].decibelToLinear,
        b = Package["flowkey:math-tools"].getRmsOfArray,
        S = Package["flowkey:math-tools"].getMaxOfArray,
        E = Package["flowkey:math-tools"].copyArray,
        x = Package["flowkey:math-tools"].getMinOfArray,
        F = Package["flowkey:math-tools"].getSumOfArray,
        C = Package["flowkey:math-tools"].getAbsSumOfArray,
        N = Package["flowkey:math-tools"].centToFrequencyRatio,
        M = Package["flowkey:math-tools"].frequencyRatioToCent,
        R = Package["flowkey:math-tools"].midiToFrequency,
        A = Package["flowkey:math-tools"].frequencyToMidi,
        T = Package["flowkey:math-tools"].calculateBinFromFrequency,
        D = Package["flowkey:math-tools"].calculateFrequencyFromBin,
        O = Package["flowkey:math-tools"].getBin,
        G = Package["flowkey:math-tools"].flashsort,
        _ = Package["flowkey:math-tools"].getFreq,
        q = Package["flowkey:math-tools"].mean,
        B = Package["flowkey:math-tools"].median,
        L = Package["flowkey:math-tools"].firstQuartile,
        V = Package["flowkey:math-tools"].thirdQuartile,
        Q = Package["flowkey:math-tools"].interQuartileRange,
        j = Package["flowkey:math-tools"].variance,
        z = Package["flowkey:math-tools"].standardDeviation,
        I = Package["flowkey:math-tools"].createLinearSpace,
        U = Package["flowkey:math-tools"].calculateMappingElementCountVector,
        Z = Package["flowkey:functionstack"].FunctionStack,
        H = Package["flowkey:dsp"].DSP,
        K = Package["flowkey:dsp"].DFT,
        W = Package["flowkey:dsp"].FFT,
        J = Package["flowkey:dsp"].Oscillator,
        X = Package["flowkey:dsp"].ADSR,
        Y = Package["flowkey:dsp"].IIRFilter,
        $ = Package["flowkey:dsp"].MultiDelay,
        ee = Package["flowkey:dsp"].WindowFunction,
        te = Package.underscore._,
        ae, oe, ne;
    (function() {
        ae = function(e) {
            var e = e || {},
                a = this;
            a.filter_midiStartNumber = 36, a.filter_midiEndNumber = 68, a.fft_midiStartNumber = a.filter_midiEndNumber, a.fft_midiEndNumber = 109, a.tuningRef = 440, a.lowNotePitches = [];
            for (var n = a.filter_midiStartNumber; n < a.filter_midiEndNumber; n++) {
                var r = R(n, a.tuningRef);
                a.lowNotePitches.push(r)
            }
            a.filterbankQ = 100, a.webaudioManager = e.webaudioManager, a.initAudioGraph(), a.currentStatus = new oe;
            try {
                a.graph = a.webaudioManager.getAudioGraph("noteDetect"), a.blockLength = a.graph.getNodeSpec("downsampleAndOverlap").settings.bufferSize, a.sampleRate = a.graph.getNodeSpec("coAnalyser").settings.sampleRate, a.injections = new Z
            } catch (i) {
                console.warn(i)
            }
            a.defaultSimThreshold = .7, a.harmonicResonanceLimitNumber = 45, a.statusBuffer = [!1, !1, !1], a.chromaMode = 2, a.setSampleRate(), a.setUpEventListener(), a.chromaFeature = new o({
                blockLength: a.blockLength,
                sampleRate: a.sampleRate,
                midiStartNumber: a.fft_midiStartNumber,
                midiEndNumber: a.fft_midiEndNumber
            });
            var s = t.bind(a.run, a);
            a.webaudioManager.changeAudioGraph("noteDetect", {
                coAnalyser: {
                    inject: [s]
                }
            }), a.statusEvent = ae.createStatusEvent()
        }, ae.createStatusEvent = function() {
            return t.events.create("noteStatus")
        }, te.extend(ae.prototype, {
            run: function(e) {
                var a = this,
                    o;
                switch (a.chromaMode) {
                    case 0:
                        o = a.graph.getNodeSpec("chromaExtractor").settings.chromaVector;
                        break;
                    case 1:
                        o = a.chromaFeature.compute(e);
                        break;
                    default:
                        var n = a.graph.getNodeSpec("chromaExtractor").settings.chromaVector,
                            r = a.chromaFeature.compute(e);
                        o = y.add(n, r)
                }
                a.expectedEvent && (a.currentStatus.set({
                    similarity: a.calcCorrelationSimilarity(a.expectedEvent.expChroma, o),
                    similarityThreshold: a.defaultSimThreshold - a.expectedEvent.tolerance,
                    chroma: o,
                    notes: a.expectedEvent.notes
                }), a.statusBuffer.shift(), a.statusBuffer.push(a.currentStatus.playedright), y.all(a.statusBuffer) && (a.lastDetectedChroma = o, a.lastDetectedNotes = a.expectedEvent.notes, a.lastEventTime = window.performance.now(), a.statusEvent.data = a.currentStatus, t.events.dispatchEvent(a.statusEvent), te.each(a.statusBuffer, function(e, t, a) {
                    e = !1
                }))), a.injections.runAll({
                    chroma: o,
                    nextEvents: this.expectedEvent || {
                        notes: [],
                        expChroma: []
                    },
                    similarity: this.currentStatus.similarity || 0,
                    similarityThreshold: this.currentStatus.similarityThreshold || 0
                })
            },
            calcCorrelationSimilarity: function(e, t) {
                var a = y.sum(e) / e.length,
                    o = y.sum(t) / t.length;
                return e = y.sub(e, a), t = y.sub(t, o), y.dot(e, t) / (y.norm2(e) * y.norm2(t))
            },
            calcCosineSimilarity: function(e, t) {
                return y.dot(e, t) / (y.norm2(e) * y.norm2(t))
            },
            setUpEventListener: function() {
                var e = this;
                t.events.listen("nextExpected", function(t) {
                    var a;
                    t.data.event.expChroma ? e.expectedEvent = t.data.event : e.expectedEvent = ae.prepareEvents(t.data.event)[0], e.setChromaMode(e.expectedEvent)
                })
            },
            setChromaMode: function(e) {
                for (var t = 0, a = e.notes.length - 1; a >= 0; a--)(e.notes[a].key < this.fft_midiStartNumber || 1 == e.notes[a].octave || 2 == e.notes[a].octave) && t++;
                t == e.notes.length ? (this.connectFilterbank(), this.chromaMode = 0) : 0 == t ? (this.disconnectFilterbank(), this.chromaMode = 1) : (this.connectFilterbank(), this.chromaMode = 2)
            },
            disconnectFilterbank: function() {
                this.webaudioManager.audioGraphs.noteDetect.nodes.chromaExtractor.disconnect()
            },
            connectFilterbank: function() {
                var e = this.webaudioManager.audioGraphs.noteDetect.nodes.chromaExtractor,
                    t = this.webaudioManager.audioGraphs.noteDetect.nodes.filterGain;
                e.connect(t)
            },
            inject: function(e) {
                this.injections.add(e)
            },
            setSampleRate: function() {
                var e = this;
                if (te.isFunction(e.sampleRate)) try {
                    e.sampleRate = e.sampleRate()
                } catch (t) {
                    e.sampleRate = 44100 / e.graph.getNodeSpec("downsampleAndOverlap").settings.downsampleFactor, console.warn("[NoteDetection] AudioContext seems to not exist.", t), console.warn("[NoteDetection] todo: remove hard code of sample Rate ")
                }
            },
            simulateEventByKey: function(e) {
                var t = [];
                te.each(e, function(e) {
                    t.push({
                        key: e,
                        pitch: e % 12,
                        octave: Math.floor(e / 12) - 1
                    })
                });
                var a = ae.prepareEvents([{
                    notes: t
                }]);
                return this.expectedEvent = a[0], this.setChromaMode(this.expectedEvent), a
            }
        }), oe = function() {
            this.similarity = 0, this.similarityThreshold = 0, this.playedright = !1, this.chroma = new w(12), this.notes = []
        }, te.extend(oe.prototype, {
            set: function(e) {
                this.similarity = e.similarity, this.similarityThreshold = e.similarityThreshold, this.playedright = this.similarity > this.similarityThreshold, this.chroma = e.chroma, this.notes = e.notes
            }
        })
    }).call(this),
        function() {
            te.extend(ae.prototype, {
                initAudioGraph: function() {
                    var e = this.webaudioManager.nodeLibrary;
                    e.clone("filter", "lowpassFilter", {
                        type: "lowpass"
                    }), e.clone("analyser", "analyser-preprocessed", {}), e.clone("gain", "filterGain", {}), e.clone("gain", "analyserGain", {});
                    for (var t = {
                            microphone: {
                                connectTo: [{
                                    node: "lowpassFilter",
                                    output: 0,
                                    input: 0
                                }]
                            },
                            channelMerger: {
                                numberOfInputs: this.lowNotePitches.length,
                                connectTo: [{
                                    node: "chromaExtractor",
                                    output: 0,
                                    input: 0
                                }]
                            },
                            chromaExtractor: {
                                bufferSize: 2048,
                                numberOfInputChannels: this.lowNotePitches.length,
                                numberOfOutputChannels: this.lowNotePitches.length
                            },
                            filterGain: {
                                connectTo: [{
                                    node: "audiocontext.destination",
                                    output: 0,
                                    input: 0
                                }],
                                gain: 0
                            },
                            lowpassFilter: {
                                frequency: function() {
                                    return this.audioContext.sampleRate / this.getSettings("downsampleAndOverlap", "downsampleFactor") / 2
                                }
                            },
                            downsampleAndOverlap: {
                                bufferSize: 2048,
                                downsampleFactor: 2
                            },
                            "analyser-preprocessed": {
                                smoothingTimeConstant: 0
                            },
                            coAnalyser: {
                                analyserNodeName: "analyser-preprocessed",
                                sampleRate: function() {
                                    return this.audioContext.sampleRate / this.getSettings("downsampleAndOverlap", "downsampleFactor")
                                }
                            },
                            analyserGain: {
                                connectTo: [{
                                    node: "audiocontext.destination",
                                    output: 0,
                                    input: 0
                                }],
                                gain: 0
                            }
                        }, a = 0; a < this.lowNotePitches.length; a++) {
                        var o = "bandpassFilter" + a,
                            n = this.lowNotePitches[a];
                        e.clone("filter", o, {}), t[o] = {
                            type: "bandpass",
                            frequency: n,
                            Q: this.filterbankQ,
                            connectTo: [{
                                node: "channelMerger",
                                output: 0,
                                input: a
                            }]
                        }, t.microphone.connectTo.push({
                            node: o,
                            output: 0,
                            input: 0
                        })
                    }
                    this.webaudioManager.createAudioGraph("noteDetect", t)
                }
            })
        }.call(this),
        function() {
            "undefined" == typeof ae && (ae = function() {});
            var t = 48;
            ae.prepareEvents = function(e) {
                te.isArray(e) || (e = [e]);
                for (var t = 0; t < e.length; t++) e[t].expChroma = ae.composeExpectedChroma(e[t].notes), e[t].tolerance = ae.setTolerance(e[t].notes);
                return e
            }, ae.setTolerance = function(a) {
                var o = .025 * (a.length - 1);
                if (e.isCordova) {
                    for (var n = 0; n < a.length; n++) a[n].key < t && (o += .1);
                    return Math.min(o, .15)
                }
                return Math.min(o, .1)
            }, ae.composeExpectedChroma = function(a) {
                for (var o = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], n = a.length - 1; n >= 0; n--) o[a[n].pitch] += 1, e.isCordova && a[n].key < 48 && (o[a[n].pitch] -= .5);
                for (var n = a.length - 1; n >= 0; n--)
                    if (a[n].key <= t) {
                        var r = Math.sqrt(1 - a[n].key / t);
                        o[(a[n].pitch + 7) % 12] += r
                    }
                return o
            };
            var a = e.settings ? e.settings["public"].debug : !0;
            ne = function(e) {
                a && console.log("[NoteDetection]" + e)
            }
        }.call(this), "undefined" == typeof Package && (Package = {}), Package["note-detection"] = {
            NoteDetection: ae
        }
}();

! function() {
    var e = Package.meteor.Meteor;
    (function() {
        (function() {
            ! function e(t, n, i) {
                function r(s, a) {
                    if (!n[s]) {
                        if (!t[s]) {
                            var c = "function" == typeof require && require;
                            if (!a && c) return c(s, !0);
                            if (o) return o(s, !0);
                            var u = new Error("Cannot find module '" + s + "'");
                            throw u.code = "MODULE_NOT_FOUND", u
                        }
                        var f = n[s] = {
                            exports: {}
                        };
                        t[s][0].call(f.exports, function(e) {
                            var n = t[s][1][e];
                            return r(n ? n : e)
                        }, f, f.exports, e, t, n, i)
                    }
                    return n[s].exports
                }
                for (var o = "function" == typeof require && require, s = 0; s < i.length; s++) r(i[s]);
                return r
            }({
                1: [function(e, t, n) {
                    e("../modules/es6.object.to-string"), e("../modules/es6.string.iterator"), e("../modules/web.dom.iterable"), e("../modules/es6.map"), t.exports = e("../modules/$").core.Map
                }, {
                    "../modules/$": 17,
                    "../modules/es6.map": 25,
                    "../modules/es6.object.to-string": 26,
                    "../modules/es6.string.iterator": 28,
                    "../modules/web.dom.iterable": 30
                }],
                2: [function(e, t, n) {
                    e("../modules/es6.object.to-string"), e("../modules/es6.string.iterator"), e("../modules/web.dom.iterable"), e("../modules/es6.set"), t.exports = e("../modules/$").core.Set
                }, {
                    "../modules/$": 17,
                    "../modules/es6.object.to-string": 26,
                    "../modules/es6.set": 27,
                    "../modules/es6.string.iterator": 28,
                    "../modules/web.dom.iterable": 30
                }],
                3: [function(e, t, n) {
                    e("../modules/es6.symbol"), t.exports = e("../modules/$").core.Symbol
                }, {
                    "../modules/$": 17,
                    "../modules/es6.symbol": 29
                }],
                4: [function(e, t, n) {
                    function i(e, t, n) {
                        if (!e) throw TypeError(n ? t + n : t)
                    }
                    var r = e("./$");
                    i.def = r.assertDefined, i.fn = function(e) {
                        if (!r.isFunction(e)) throw TypeError(e + " is not a function!");
                        return e
                    }, i.obj = function(e) {
                        if (!r.isObject(e)) throw TypeError(e + " is not an object!");
                        return e
                    }, i.inst = function(e, t, n) {
                        if (!(e instanceof t)) throw TypeError(n + ": use the 'new' operator!");
                        return e
                    }, t.exports = i
                }, {
                    "./$": 17
                }],
                5: [function(e, t, n) {
                    function i(e) {
                        return s.call(e).slice(8, -1)
                    }
                    var r = e("./$"),
                        o = e("./$.wks")("toStringTag"),
                        s = {}.toString;
                    i.classof = function(e) {
                        var t, n;
                        return void 0 == e ? void 0 === e ? "Undefined" : "Null" : "string" == typeof(n = (t = Object(e))[o]) ? n : i(t)
                    }, i.set = function(e, t, n) {
                        e && !r.has(e = n ? e : e.prototype, o) && r.hide(e, o, t)
                    }, t.exports = i
                }, {
                    "./$": 17,
                    "./$.wks": 23
                }],
                6: [function(e, t, n) {
                    "use strict";

                    function i(e, t) {
                        if (!h(e)) return ("string" == typeof e ? "S" : "P") + e;
                        if (v(e)) return "F";
                        if (!l(e, m)) {
                            if (!t) return "E";
                            p(e, m, ++_)
                        }
                        return "O" + e[m]
                    }

                    function r(e, t) {
                        var n = i(t),
                            r;
                        if ("F" != n) return e[g][n];
                        for (r = e[b]; r; r = r.n)
                            if (r.k == t) return r
                    }
                    var o = e("./$"),
                        s = e("./$.ctx"),
                        a = e("./$.uid").safe,
                        c = e("./$.assert"),
                        u = e("./$.for-of"),
                        f = e("./$.iter").step,
                        l = o.has,
                        d = o.set,
                        h = o.isObject,
                        p = o.hide,
                        v = Object.isFrozen || o.core.Object.isFrozen,
                        m = a("id"),
                        g = a("O1"),
                        y = a("last"),
                        b = a("first"),
                        w = a("iter"),
                        $ = o.DESC ? a("size") : "size",
                        _ = 0;
                    t.exports = {
                        getConstructor: function(e, t, n) {
                            function i() {
                                var r = c.inst(this, i, e),
                                    s = arguments[0];
                                d(r, g, o.create(null)), d(r, $, 0), d(r, y, void 0), d(r, b, void 0), void 0 != s && u(s, t, r[n], r)
                            }
                            return o.mix(i.prototype, {
                                clear: function a() {
                                    for (var e = this, t = e[g], n = e[b]; n; n = n.n) n.r = !0, n.p && (n.p = n.p.n = void 0), delete t[n.i];
                                    e[b] = e[y] = void 0, e[$] = 0
                                },
                                "delete": function(e) {
                                    var t = this,
                                        n = r(t, e);
                                    if (n) {
                                        var i = n.n,
                                            o = n.p;
                                        delete t[g][n.i], n.r = !0, o && (o.n = i), i && (i.p = o), t[b] == n && (t[b] = i), t[y] == n && (t[y] = o), t[$]--
                                    }
                                    return !!n
                                },
                                forEach: function f(e) {
                                    for (var t = s(e, arguments[1], 3), n; n = n ? n.n : this[b];)
                                        for (t(n.v, n.k, this); n && n.r;) n = n.p
                                },
                                has: function l(e) {
                                    return !!r(this, e)
                                }
                            }), o.DESC && o.setDesc(i.prototype, "size", {
                                get: function() {
                                    return c.def(this[$])
                                }
                            }), i
                        },
                        def: function(e, t, n) {
                            var o = r(e, t),
                                s, a;
                            return o ? o.v = n : (e[y] = o = {
                                i: a = i(t, !0),
                                k: t,
                                v: n,
                                p: s = e[y],
                                n: void 0,
                                r: !1
                            }, e[b] || (e[b] = o), s && (s.n = o), e[$]++, "F" != a && (e[g][a] = o)), e
                        },
                        getEntry: r,
                        setIter: function(t, n, i) {
                            e("./$.iter-define")(t, n, function(e, t) {
                                d(this, w, {
                                    o: e,
                                    k: t
                                })
                            }, function() {
                                for (var e = this[w], t = e.k, n = e.l; n && n.r;) n = n.p;
                                return e.o && (e.l = n = n ? n.n : e.o[b]) ? "keys" == t ? f(0, n.k) : "values" == t ? f(0, n.v) : f(0, [n.k, n.v]) : (e.o = void 0, f(1))
                            }, i ? "entries" : "values", !i, !0)
                        }
                    }
                }, {
                    "./$": 17,
                    "./$.assert": 4,
                    "./$.ctx": 8,
                    "./$.for-of": 11,
                    "./$.iter": 16,
                    "./$.iter-define": 14,
                    "./$.uid": 21
                }],
                7: [function(e, t, n) {
                    "use strict";
                    var i = e("./$"),
                        r = e("./$.def"),
                        o = e("./$.iter").BUGGY,
                        s = e("./$.for-of"),
                        a = e("./$.species"),
                        c = e("./$.assert").inst;
                    t.exports = function(t, n, u, f, l) {
                        function d(e, t) {
                            var n = m[e];
                            i.FW && (m[e] = function(e, i) {
                                var r = n.call(this, 0 === e ? 0 : e, i);
                                return t ? this : r
                            })
                        }
                        var h = i.g[t],
                            p = h,
                            v = f ? "set" : "add",
                            m = p && p.prototype,
                            g = {};
                        if (i.isFunction(p) && (l || !o && m.forEach && m.entries)) {
                            var y = new p,
                                b = y[v](l ? {} : -0, 1),
                                w;
                            e("./$.iter-detect")(function(e) {
                                new p(e)
                            }) || (p = function() {
                                c(this, p, t);
                                var e = new h,
                                    n = arguments[0];
                                return void 0 != n && s(n, f, e[v], e), e
                            }, p.prototype = m, i.FW && (m.constructor = p)), l || y.forEach(function(e, t) {
                                w = 1 / t === -(1 / 0)
                            }), w && (d("delete"), d("has"), f && d("get")), (w || b !== y) && d(v, !0)
                        } else p = u.getConstructor(t, f, v), i.mix(p.prototype, n);
                        return e("./$.cof").set(p, t), g[t] = p, r(r.G + r.W + r.F * (p != h), g), a(p), a(i.core[t]), l || u.setIter(p, t, f), p
                    }
                }, {
                    "./$": 17,
                    "./$.assert": 4,
                    "./$.cof": 5,
                    "./$.def": 9,
                    "./$.for-of": 11,
                    "./$.iter": 16,
                    "./$.iter-detect": 15,
                    "./$.species": 19
                }],
                8: [function(e, t, n) {
                    var i = e("./$.assert").fn;
                    t.exports = function(e, t, n) {
                        if (i(e), ~n && void 0 === t) return e;
                        switch (n) {
                            case 1:
                                return function(n) {
                                    return e.call(t, n)
                                };
                            case 2:
                                return function(n, i) {
                                    return e.call(t, n, i)
                                };
                            case 3:
                                return function(n, i, r) {
                                    return e.call(t, n, i, r)
                                }
                        }
                        return function() {
                            return e.apply(t, arguments)
                        }
                    }
                }, {
                    "./$.assert": 4
                }],
                9: [function(e, t, n) {
                    function i(e, t) {
                        return function() {
                            return e.apply(t, arguments)
                        }
                    }

                    function r(e, t, n) {
                        var u, f, l, d, h = e & r.G,
                            p = h ? s : e & r.S ? s[t] : (s[t] || {}).prototype,
                            v = h ? a : a[t] || (a[t] = {});
                        h && (n = t);
                        for (u in n) f = !(e & r.F) && p && u in p, l = (f ? p : n)[u], d = e & r.B && f ? i(l, s) : e & r.P && c(l) ? i(Function.call, l) : l, p && !f && (h ? p[u] = l : delete p[u] && o.hide(p, u, l)), v[u] != l && o.hide(v, u, d)
                    }
                    var o = e("./$"),
                        s = o.g,
                        a = o.core,
                        c = o.isFunction;
                    s.core = a, r.F = 1, r.G = 2, r.S = 4, r.P = 8, r.B = 16, r.W = 32, t.exports = r
                }, {
                    "./$": 17
                }],
                10: [function(e, t, n) {
                    var i = e("./$");
                    t.exports = function(e) {
                        var t = i.getKeys(e),
                            n = i.getDesc,
                            r = i.getSymbols;
                        return r && i.each.call(r(e), function(i) {
                            n(e, i).enumerable && t.push(i)
                        }), t
                    }
                }, {
                    "./$": 17
                }],
                11: [function(e, t, n) {
                    var i = e("./$.ctx"),
                        r = e("./$.iter").get,
                        o = e("./$.iter-call");
                    t.exports = function(e, t, n, s) {
                        for (var a = r(e), c = i(n, s, t ? 2 : 1), u; !(u = a.next()).done;)
                            if (o(a, c, u.value, t) === !1) return o.close(a)
                    }
                }, {
                    "./$.ctx": 8,
                    "./$.iter": 16,
                    "./$.iter-call": 13
                }],
                12: [function(e, t, n) {
                    t.exports = function(e) {
                        return e.FW = !0, e.path = e.g, e
                    }
                }, {}],
                13: [function(e, t, n) {
                    function i(e) {
                        var t = e["return"];
                        void 0 !== t && o(t.call(e))
                    }

                    function r(e, t, n, r) {
                        try {
                            return r ? t(o(n)[0], n[1]) : t(n)
                        } catch (s) {
                            throw i(e), s
                        }
                    }
                    var o = e("./$.assert").obj;
                    r.close = i, t.exports = r
                }, {
                    "./$.assert": 4
                }],
                14: [function(e, t, n) {
                    var i = e("./$.def"),
                        r = e("./$"),
                        o = e("./$.cof"),
                        s = e("./$.iter"),
                        a = e("./$.wks")("iterator"),
                        c = "@@iterator",
                        u = "values",
                        f = s.Iterators;
                    t.exports = function(e, t, n, l, d, h, p) {
                        function v(e) {
                            return function() {
                                return new n(this, e)
                            }
                        }
                        s.create(n, t, l);
                        var m = t + " Iterator",
                            g = e.prototype,
                            y = g[a] || g[c] || d && g[d],
                            b = y || v(d),
                            w, $;
                        if (y) {
                            var _ = r.getProto(b.call(new e));
                            o.set(_, m, !0), r.FW && r.has(g, c) && s.set(_, r.that)
                        }
                        if (r.FW && s.set(g, b), f[t] = b, f[m] = r.that, d)
                            if (w = {
                                    keys: h ? b : v("keys"),
                                    values: d == u ? b : v(u),
                                    entries: d != u ? b : v("entries")
                                }, p)
                                for ($ in w) $ in g || r.hide(g, $, w[$]);
                            else i(i.P + i.F * s.BUGGY, t, w)
                    }
                }, {
                    "./$": 17,
                    "./$.cof": 5,
                    "./$.def": 9,
                    "./$.iter": 16,
                    "./$.wks": 23
                }],
                15: [function(e, t, n) {
                    var i = e("./$.wks")("iterator"),
                        r = !1;
                    try {
                        var o = [7][i]();
                        o["return"] = function() {
                            r = !0
                        }, Array.from(o, function() {
                            throw 2
                        })
                    } catch (s) {}
                    t.exports = function(e) {
                        if (!r) return !1;
                        var t = !1;
                        try {
                            var n = [7],
                                o = n[i]();
                            o.next = function() {
                                t = !0
                            }, n[i] = function() {
                                return o
                            }, e(n)
                        } catch (s) {}
                        return t
                    }
                }, {
                    "./$.wks": 23
                }],
                16: [function(e, t, n) {
                    "use strict";

                    function i(e, t) {
                        r.hide(e, a, t), c in [] && r.hide(e, c, t)
                    }
                    var r = e("./$"),
                        o = e("./$.cof"),
                        s = e("./$.assert").obj,
                        a = e("./$.wks")("iterator"),
                        c = "@@iterator",
                        u = {},
                        f = {};
                    i(f, r.that), t.exports = {
                        BUGGY: "keys" in [] && !("next" in [].keys()),
                        Iterators: u,
                        step: function(e, t) {
                            return {
                                value: t,
                                done: !!e
                            }
                        },
                        is: function(e) {
                            var t = Object(e),
                                n = r.g.Symbol,
                                i = n && n.iterator || c;
                            return i in t || a in t || r.has(u, o.classof(t))
                        },
                        get: function(e) {
                            var t = r.g.Symbol,
                                n = e[t && t.iterator || c],
                                i = n || e[a] || u[o.classof(e)];
                            return s(i.call(e))
                        },
                        set: i,
                        create: function(e, t, n, i) {
                            e.prototype = r.create(i || f, {
                                next: r.desc(1, n)
                            }), o.set(e, t + " Iterator")
                        }
                    }
                }, {
                    "./$": 17,
                    "./$.assert": 4,
                    "./$.cof": 5,
                    "./$.wks": 23
                }],
                17: [function(e, t, n) {
                    "use strict";

                    function i(e) {
                        return isNaN(e = +e) ? 0 : (e > 0 ? v : p)(e)
                    }

                    function r(e, t) {
                        return {
                            enumerable: !(1 & e),
                            configurable: !(2 & e),
                            writable: !(4 & e),
                            value: t
                        }
                    }

                    function o(e, t, n) {
                        return e[t] = n, e
                    }

                    function s(e) {
                        return y ? function(t, n, i) {
                            return w.setDesc(t, n, r(e, i))
                        } : o
                    }

                    function a(e) {
                        return null !== e && ("object" == typeof e || "function" == typeof e)
                    }

                    function c(e) {
                        return "function" == typeof e
                    }

                    function u(e) {
                        if (void 0 == e) throw TypeError("Can't call method on  " + e);
                        return e
                    }
                    var f = "undefined" != typeof self ? self : Function("return this")(),
                        l = {},
                        d = Object.defineProperty,
                        h = {}.hasOwnProperty,
                        p = Math.ceil,
                        v = Math.floor,
                        m = Math.max,
                        g = Math.min,
                        y = !! function() {
                            try {
                                return 2 == d({}, "a", {
                                    get: function() {
                                        return 2
                                    }
                                }).a
                            } catch (e) {}
                        }(),
                        b = s(1),
                        w = t.exports = e("./$.fw")({
                            g: f,
                            core: l,
                            html: f.document && document.documentElement,
                            isObject: a,
                            isFunction: c,
                            it: function(e) {
                                return e
                            },
                            that: function() {
                                return this
                            },
                            toInteger: i,
                            toLength: function(e) {
                                return e > 0 ? g(i(e), 9007199254740991) : 0
                            },
                            toIndex: function(e, t) {
                                return e = i(e), 0 > e ? m(e + t, 0) : g(e, t)
                            },
                            has: function(e, t) {
                                return h.call(e, t)
                            },
                            create: Object.create,
                            getProto: Object.getPrototypeOf,
                            DESC: y,
                            desc: r,
                            getDesc: Object.getOwnPropertyDescriptor,
                            setDesc: d,
                            setDescs: Object.defineProperties,
                            getKeys: Object.keys,
                            getNames: Object.getOwnPropertyNames,
                            getSymbols: Object.getOwnPropertySymbols,
                            assertDefined: u,
                            ES5Object: Object,
                            toObject: function(e) {
                                return w.ES5Object(u(e))
                            },
                            hide: b,
                            def: s(0),
                            set: f.Symbol ? o : b,
                            mix: function(e, t) {
                                for (var n in t) b(e, n, t[n]);
                                return e
                            },
                            each: [].forEach
                        });
                    "undefined" != typeof __e && (__e = l), "undefined" != typeof __g && (__g = f)
                }, {
                    "./$.fw": 12
                }],
                18: [function(e, t, n) {
                    var i = e("./$");
                    t.exports = function(e, t) {
                        for (var n = i.toObject(e), r = i.getKeys(n), o = r.length, s = 0, a; o > s;)
                            if (n[a = r[s++]] === t) return a
                    }
                }, {
                    "./$": 17
                }],
                19: [function(e, t, n) {
                    var i = e("./$"),
                        r = e("./$.wks")("species");
                    t.exports = function(e) {
                        !i.DESC || r in e || i.setDesc(e, r, {
                            configurable: !0,
                            get: i.that
                        })
                    }
                }, {
                    "./$": 17,
                    "./$.wks": 23
                }],
                20: [function(e, t, n) {
                    "use strict";
                    var i = e("./$");
                    t.exports = function(e) {
                        return function(t) {
                            var n = String(i.assertDefined(this)),
                                r = i.toInteger(t),
                                o = n.length,
                                s, a;
                            return 0 > r || r >= o ? e ? "" : void 0 : (s = n.charCodeAt(r), 55296 > s || s > 56319 || r + 1 === o || (a = n.charCodeAt(r + 1)) < 56320 || a > 57343 ? e ? n.charAt(r) : s : e ? n.slice(r, r + 2) : (s - 55296 << 10) + (a - 56320) + 65536)
                        }
                    }
                }, {
                    "./$": 17
                }],
                21: [function(e, t, n) {
                    function i(e) {
                        return "Symbol(" + e + ")_" + (++r + Math.random()).toString(36)
                    }
                    var r = 0;
                    i.safe = e("./$").g.Symbol || i, t.exports = i
                }, {
                    "./$": 17
                }],
                22: [function(e, t, n) {
                    var i = e("./$"),
                        r = e("./$.wks")("unscopables");
                    !i.FW || r in [] || i.hide(Array.prototype, r, {}), t.exports = function(e) {
                        i.FW && ([][r][e] = !0)
                    }
                }, {
                    "./$": 17,
                    "./$.wks": 23
                }],
                23: [function(e, t, n) {
                    var i = e("./$").g,
                        r = {};
                    t.exports = function(t) {
                        return r[t] || (r[t] = i.Symbol && i.Symbol[t] || e("./$.uid").safe("Symbol." + t))
                    }
                }, {
                    "./$": 17,
                    "./$.uid": 21
                }],
                24: [function(e, t, n) {
                    var i = e("./$"),
                        r = e("./$.unscope"),
                        o = e("./$.uid").safe("iter"),
                        s = e("./$.iter"),
                        a = s.step,
                        c = s.Iterators;
                    e("./$.iter-define")(Array, "Array", function(e, t) {
                        i.set(this, o, {
                            o: i.toObject(e),
                            i: 0,
                            k: t
                        })
                    }, function() {
                        var e = this[o],
                            t = e.o,
                            n = e.k,
                            i = e.i++;
                        return !t || i >= t.length ? (e.o = void 0, a(1)) : "keys" == n ? a(0, i) : "values" == n ? a(0, t[i]) : a(0, [i, t[i]])
                    }, "values"), c.Arguments = c.Array, r("keys"), r("values"), r("entries")
                }, {
                    "./$": 17,
                    "./$.iter": 16,
                    "./$.iter-define": 14,
                    "./$.uid": 21,
                    "./$.unscope": 22
                }],
                25: [function(e, t, n) {
                    "use strict";
                    var i = e("./$.collection-strong");
                    e("./$.collection")("Map", {
                        get: function r(e) {
                            var t = i.getEntry(this, e);
                            return t && t.v
                        },
                        set: function o(e, t) {
                            return i.def(this, 0 === e ? 0 : e, t)
                        }
                    }, i, !0)
                }, {
                    "./$.collection": 7,
                    "./$.collection-strong": 6
                }],
                26: [function(e, t, n) {
                    "use strict";
                    var i = e("./$"),
                        r = e("./$.cof"),
                        o = {};
                    o[e("./$.wks")("toStringTag")] = "z", i.FW && "z" != r(o) && i.hide(Object.prototype, "toString", function s() {
                        return "[object " + r.classof(this) + "]"
                    })
                }, {
                    "./$": 17,
                    "./$.cof": 5,
                    "./$.wks": 23
                }],
                27: [function(e, t, n) {
                    "use strict";
                    var i = e("./$.collection-strong");
                    e("./$.collection")("Set", {
                        add: function r(e) {
                            return i.def(this, e = 0 === e ? 0 : e, e)
                        }
                    }, i)
                }, {
                    "./$.collection": 7,
                    "./$.collection-strong": 6
                }],
                28: [function(e, t, n) {
                    var i = e("./$").set,
                        r = e("./$.string-at")(!0),
                        o = e("./$.uid").safe("iter"),
                        s = e("./$.iter"),
                        a = s.step;
                    e("./$.iter-define")(String, "String", function(e) {
                        i(this, o, {
                            o: String(e),
                            i: 0
                        })
                    }, function() {
                        var e = this[o],
                            t = e.o,
                            n = e.i,
                            i;
                        return n >= t.length ? a(1) : (i = r.call(t, n), e.i += i.length, a(0, i))
                    })
                }, {
                    "./$": 17,
                    "./$.iter": 16,
                    "./$.iter-define": 14,
                    "./$.string-at": 20,
                    "./$.uid": 21
                }],
                29: [function(e, t, n) {
                    "use strict";

                    function i(e) {
                        var t = S[e] = f.set(y(x.prototype), O, e);
                        return f.DESC && j && w(Object.prototype, e, {
                            configurable: !0,
                            set: function(t) {
                                g(this, M) && g(this[M], e) && (this[M][e] = !1), w(this, e, $(1, t))
                            }
                        }), t
                    }

                    function r(e, t, n) {
                        return n && g(S, t) && (n.enumerable ? (g(e, M) && e[M][t] && (e[M][t] = !1), n.enumerable = !1) : (g(e, M) || w(e, M, $(1, {})), e[M][t] = !0)), w(e, t, n)
                    }

                    function o(e, t) {
                        m(e);
                        for (var n = v(t = I(t)), i = 0, o = n.length, s; o > i;) r(e, s = n[i++], t[s]);
                        return e
                    }

                    function s(e, t) {
                        return void 0 === t ? y(e) : o(y(e), t)
                    }

                    function a(e, t) {
                        var n = b(e = I(e), t);
                        return !n || !g(S, t) || g(e, M) && e[M][t] || (n.enumerable = !0), n
                    }

                    function c(e) {
                        for (var t = _(I(e)), n = [], i = 0, r; t.length > i;) g(S, r = t[i++]) || r == M || n.push(r);
                        return n
                    }

                    function u(e) {
                        for (var t = _(I(e)), n = [], i = 0, r; t.length > i;) g(S, r = t[i++]) && n.push(S[r]);
                        return n
                    }
                    var f = e("./$"),
                        l = e("./$.cof").set,
                        d = e("./$.uid"),
                        h = e("./$.def"),
                        p = e("./$.keyof"),
                        v = e("./$.enum-keys"),
                        m = e("./$.assert").obj,
                        g = f.has,
                        y = f.create,
                        b = f.getDesc,
                        w = f.setDesc,
                        $ = f.desc,
                        _ = f.getNames,
                        I = f.toObject,
                        x = f.g.Symbol,
                        j = !1,
                        O = d("tag"),
                        M = d("hidden"),
                        D = {},
                        S = {},
                        k = f.isFunction(x);
                    k || (x = function E(e) {
                        if (this instanceof E) throw TypeError("Symbol is not a constructor");
                        return i(d(e))
                    }, f.hide(x.prototype, "toString", function() {
                        return this[O]
                    }), f.create = s, f.setDesc = r, f.getDesc = a, f.setDescs = o, f.getNames = c, f.getSymbols = u);
                    var z = {
                        "for": function(e) {
                            return g(D, e += "") ? D[e] : D[e] = x(e)
                        },
                        keyFor: function P(e) {
                            return p(D, e)
                        },
                        useSetter: function() {
                            j = !0
                        },
                        useSimple: function() {
                            j = !1
                        }
                    };
                    f.each.call("hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), function(t) {
                        var n = e("./$.wks")(t);
                        z[t] = k ? n : i(n)
                    }), j = !0, h(h.G + h.W, {
                        Symbol: x
                    }), h(h.S, "Symbol", z), h(h.S + h.F * !k, "Object", {
                        create: s,
                        defineProperty: r,
                        defineProperties: o,
                        getOwnPropertyDescriptor: a,
                        getOwnPropertyNames: c,
                        getOwnPropertySymbols: u
                    }), l(x, "Symbol"), l(Math, "Math", !0), l(f.g.JSON, "JSON", !0)
                }, {
                    "./$": 17,
                    "./$.assert": 4,
                    "./$.cof": 5,
                    "./$.def": 9,
                    "./$.enum-keys": 10,
                    "./$.keyof": 18,
                    "./$.uid": 21,
                    "./$.wks": 23
                }],
                30: [function(e, t, n) {
                    e("./es6.array.iterator");
                    var i = e("./$"),
                        r = e("./$.iter").Iterators,
                        o = e("./$.wks")("iterator"),
                        s = r.Array,
                        a = i.g.NodeList;
                    !i.FW || !a || o in a.prototype || i.hide(a.prototype, o, s), r.NodeList = s
                }, {
                    "./$": 17,
                    "./$.iter": 16,
                    "./$.wks": 23,
                    "./es6.array.iterator": 24
                }],
                31: [function(e, t, n) {
                    function i() {
                        if (!a) {
                            a = !0;
                            for (var e, t = s.length; t;) {
                                e = s, s = [];
                                for (var n = -1; ++n < t;) e[n]();
                                t = s.length
                            }
                            a = !1
                        }
                    }

                    function r() {}
                    var o = t.exports = {},
                        s = [],
                        a = !1;
                    o.nextTick = function(e) {
                        s.push(e), a || setTimeout(i, 0)
                    }, o.title = "browser", o.browser = !0, o.env = {}, o.argv = [], o.version = "", o.versions = {}, o.on = r, o.addListener = r, o.once = r, o.off = r, o.removeListener = r, o.removeAllListeners = r, o.emit = r, o.binding = function(e) {
                        throw new Error("process.binding is not supported")
                    }, o.cwd = function() {
                        return "/"
                    }, o.chdir = function(e) {
                        throw new Error("process.chdir is not supported")
                    }, o.umask = function() {
                        return 0
                    }
                }, {}],
                32: [function(e, t, n) {
                    "use strict";

                    function i(e) {
                        var t = "jazz_" + a++ + Date.now(),
                            n = void 0,
                            i = void 0,
                            r = void 0;
                        if (o.getDevice().nodejs === !0) i = new window.jazzMidi.MIDI;
                        else {
                            var u = document.createElement("object");
                            u.id = t + "ie", u.classid = "CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90", r = u;
                            var f = document.createElement("object");
                            f.id = t, f.type = "audio/x-jazz", u.appendChild(f), i = f;
                            var l = document.createElement("p");
                            l.appendChild(document.createTextNode("This page requires the "));
                            var d = document.createElement("a");
                            d.appendChild(document.createTextNode("Jazz plugin")), d.href = "http://jazz-soft.net/", l.appendChild(d), l.appendChild(document.createTextNode(".")), f.appendChild(l);
                            var h = document.getElementById("MIDIPlugin");
                            h || (h = document.createElement("div"), h.id = "MIDIPlugin", h.style.position = "absolute", h.style.visibility = "hidden", h.style.left = "-9999px", h.style.top = "-9999px", document.body.appendChild(h)), h.appendChild(u)
                        }
                        setTimeout(function() {
                            i.isJazz === !0 ? n = i : r.isJazz === !0 && (n = r), void 0 !== n && (n._perfTimeZero = window.performance.now(), c.set(t, n)), e(n)
                        }, s)
                    }

                    function r(e, t) {
                        var n = null,
                            r = "input" === e ? "inputInUse" : "outputInUse",
                            o = !0,
                            s = !1,
                            a = void 0;
                        try {
                            for (var u = c.values()[Symbol.iterator](), f; !(o = (f = u.next()).done); o = !0) {
                                var l = f.value;
                                if (l[r] !== !0) {
                                    n = l;
                                    break
                                }
                            }
                        } catch (d) {
                            s = !0, a = d
                        } finally {
                            try {
                                !o && u["return"] && u["return"]()
                            } finally {
                                if (s) throw a
                            }
                        }
                        null === n ? i(t) : t(n)
                    }
                    Object.defineProperty(n, "__esModule", {
                        value: !0
                    }), n.createJazzInstance = i, n.getJazzInstance = r;
                    var o = e("./util");
                    e("babelify/node_modules/babel-core/node_modules/core-js/es6/map"), e("babelify/node_modules/babel-core/node_modules/core-js/es6/set"), e("babelify/node_modules/babel-core/node_modules/core-js/es6/symbol");
                    var s = 100,
                        a = 0,
                        c = new Map
                }, {
                    "./util": 39,
                    "babelify/node_modules/babel-core/node_modules/core-js/es6/map": 1,
                    "babelify/node_modules/babel-core/node_modules/core-js/es6/set": 2,
                    "babelify/node_modules/babel-core/node_modules/core-js/es6/symbol": 3
                }],
                33: [function(e, t, n) {
                    "use strict";

                    function i() {
                        return new Promise(function e(t, n) {
                            return void 0 !== b ? void t(b) : "ie9" === y.getDevice().browser ? void n({
                                message: "WebMIDIAPIShim supports Internet Explorer 10 and above."
                            }) : void p.createJazzInstance(function(e) {
                                return void 0 === e ? void n({
                                    message: "No access to MIDI devices: browser does not support the WebMIDI API and the Jazz plugin is not installed."
                                }) : (w = e, void r(function() {
                                    c(), b = new O($, _), t(b)
                                }))
                            })
                        })
                    }

                    function r(e) {
                        var t = w.MidiInList(),
                            n = w.MidiOutList(),
                            i = t.length,
                            r = n.length;
                        o(0, i, "input", t, function() {
                            o(0, r, "output", n, e)
                        })
                    }

                    function o(e, t, n, i, r) {
                        if (t > e) {
                            var a = i[e++];
                            s(n, a, function() {
                                o(e, t, n, i, r)
                            })
                        } else r()
                    }

                    function s(e, t, n) {
                        p.getJazzInstance(e, function(i) {
                            var r = void 0,
                                o = [t, "", ""];
                            "input" === e ? (i.Support("MidiInInfo") && (o = i.MidiInInfo(t)), r = new v.MIDIInput(o, i), $.set(r.id, r)) : "output" === e && (i.Support("MidiOutInfo") && (o = i.MidiOutInfo(t)), r = new m.MIDIOutput(o, i), _.set(r.id, r)), n(r)
                        })
                    }

                    function a(e, t) {
                        var n = void 0,
                            i = !0,
                            r = !1,
                            o = void 0;
                        try {
                            for (var s = e.values()[Symbol.iterator](), a; !(i = (a = s.next()).done) && (n = a.value, n.name !== t); i = !0);
                        } catch (c) {
                            r = !0, o = c
                        } finally {
                            try {
                                !i && s["return"] && s["return"]()
                            } finally {
                                if (r) throw o
                            }
                        }
                        return n
                    }

                    function c() {
                        w.OnDisconnectMidiIn(function(e) {
                            var t = a($, e);
                            void 0 !== t && (t.state = "disconnected", t.close(), t._jazzInstance.inputInUse = !1, $["delete"](t.id), u(t))
                        }), w.OnDisconnectMidiOut(function(e) {
                            var t = a(_, e);
                            void 0 !== t && (t.state = "disconnected", t.close(), t._jazzInstance.outputInUse = !1, _["delete"](t.id), u(t))
                        }), w.OnConnectMidiIn(function(e) {
                            s("input", e, function(e) {
                                u(e)
                            })
                        }), w.OnConnectMidiOut(function(e) {
                            s("output", e, function(e) {
                                u(e)
                            })
                        })
                    }

                    function u(e) {
                        e.dispatchEvent(new g.MIDIConnectionEvent(e, e));
                        var t = new g.MIDIConnectionEvent(b, e);
                        "function" == typeof b.onstatechange && b.onstatechange(t);
                        var n = !0,
                            i = !1,
                            r = void 0;
                        try {
                            for (var o = j[Symbol.iterator](), s; !(n = (s = o.next()).done); n = !0) {
                                var a = s.value;
                                a(t)
                            }
                        } catch (c) {
                            i = !0, r = c
                        } finally {
                            try {
                                !n && o["return"] && o["return"]()
                            } finally {
                                if (i) throw r
                            }
                        }
                    }

                    function f() {
                        $.forEach(function(e) {
                            e._jazzInstance.MidiInClose()
                        })
                    }

                    function l(e, t) {
                        var n = void 0;
                        return "input" === t ? (n = I.get(e), void 0 === n && (n = y.generateUUID(), I.set(e, n))) : "output" === t && (n = x.get(e), void 0 === n && (n = y.generateUUID(), x.set(e, n))), n
                    }
                    var d = function(e, t) {
                            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                        },
                        h = function() {
                            function e(e, t) {
                                for (var n = 0; n < t.length; n++) {
                                    var i = t[n];
                                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
                                }
                            }
                            return function(t, n, i) {
                                return n && e(t.prototype, n), i && e(t, i), t
                            }
                        }();
                    Object.defineProperty(n, "__esModule", {
                        value: !0
                    }), n.createMIDIAccess = i, n.dispatchEvent = u, n.closeAllMIDIInputs = f, n.getMIDIDeviceId = l;
                    var p = e("./jazz_instance"),
                        v = e("./midi_input"),
                        m = e("./midi_output"),
                        g = e("./midiconnection_event"),
                        y = e("./util"),
                        b = void 0,
                        w = void 0,
                        $ = new Map,
                        _ = new Map,
                        I = new Map,
                        x = new Map,
                        j = new Set,
                        O = function() {
                            function e(t, n) {
                                d(this, e), this.sysexEnabled = !0, this.inputs = t, this.outputs = n
                            }
                            return h(e, [{
                                key: "addEventListener",
                                value: function t(e, n, i) {
                                    "statechange" === e && j.has(n) === !1 && j.add(n)
                                }
                            }, {
                                key: "removeEventListener",
                                value: function n(e, t, i) {
                                    "statechange" === e && j.has(t) === !0 && j["delete"](t)
                                }
                            }]), e
                        }()
                }, {
                    "./jazz_instance": 32,
                    "./midi_input": 34,
                    "./midi_output": 35,
                    "./midiconnection_event": 36,
                    "./util": 39
                }],
                34: [function(e, t, n) {
                    "use strict";
                    var i = function(e, t) {
                            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                        },
                        r = function() {
                            function e(e, t) {
                                for (var n = 0; n < t.length; n++) {
                                    var i = t[n];
                                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
                                }
                            }
                            return function(t, n, i) {
                                return n && e(t.prototype, n), i && e(t, i), t
                            }
                        }();
                    Object.defineProperty(n, "__esModule", {
                        value: !0
                    });
                    var o = e("./util"),
                        s = e("./midimessage_event"),
                        a = e("./midiconnection_event"),
                        c = e("./midi_access"),
                        u = void 0,
                        f = o.getDevice().nodejs,
                        l = function() {
                            function e(t, n) {
                                i(this, e), this.id = c.getMIDIDeviceId(t[0], "input"), this.name = t[0], this.manufacturer = t[1], this.version = t[2], this.type = "input", this.state = "connected", this.connection = "pending", this.onstatechange = null, this._onmidimessage = null, Object.defineProperty(this, "onmidimessage", {
                                    set: function r(e) {
                                        this._onmidimessage = e, "function" == typeof e && this.open()
                                    }
                                }), this._listeners = (new Map).set("midimessage", new Set).set("statechange", new Set), this._inLongSysexMessage = !1, this._sysexBuffer = new Uint8Array, this._jazzInstance = n, this._jazzInstance.inputInUse = !0, "linux" === o.getDevice().platform && this._jazzInstance.MidiInOpen(this.name, u.bind(this))
                            }
                            return r(e, [{
                                key: "addEventListener",
                                value: function t(e, n, i) {
                                    var r = this._listeners.get(e);
                                    void 0 !== r && r.has(n) === !1 && r.add(n)
                                }
                            }, {
                                key: "removeEventListener",
                                value: function n(e, t, i) {
                                    var r = this._listeners.get(e);
                                    void 0 !== r && r.has(t) === !1 && r["delete"](t)
                                }
                            }, {
                                key: "preventDefault",
                                value: function s() {
                                    this._pvtDef = !0
                                }
                            }, {
                                key: "dispatchEvent",
                                value: function a(e) {
                                    this._pvtDef = !1;
                                    var t = this._listeners.get(e.type);
                                    return t.forEach(function(t) {
                                        t(e)
                                    }), "midimessage" === e.type ? null !== this._onmidimessage && this._onmidimessage(e) : "statechange" === e.type && null !== this.onstatechange && this.onstatechange(e), this._pvtDef
                                }
                            }, {
                                key: "open",
                                value: function f() {
                                    "open" !== this.connection && ("linux" !== o.getDevice().platform && this._jazzInstance.MidiInOpen(this.name, u.bind(this)), this.connection = "open", c.dispatchEvent(this))
                                }
                            }, {
                                key: "close",
                                value: function l() {
                                    "closed" !== this.connection && ("linux" !== o.getDevice().platform && this._jazzInstance.MidiInClose(), this.connection = "closed", c.dispatchEvent(this), this._onmidimessage = null, this.onstatechange = null, this._listeners.get("midimessage").clear(), this._listeners.get("statechange").clear())
                                }
                            }, {
                                key: "_appendToSysexBuffer",
                                value: function d(e) {
                                    var t = this._sysexBuffer.length,
                                        n = new Uint8Array(t + e.length);
                                    n.set(this._sysexBuffer), n.set(e, t), this._sysexBuffer = n
                                }
                            }, {
                                key: "_bufferLongSysex",
                                value: function h(e, t) {
                                    for (var n = t; n < e.length;) {
                                        if (247 == e[n]) return n++, this._appendToSysexBuffer(e.slice(t, n)), n;
                                        n++
                                    }
                                    return this._appendToSysexBuffer(e.slice(t, n)), this._inLongSysexMessage = !0, n
                                }
                            }]), e
                        }();
                    n.MIDIInput = l, u = function(e, t) {
                        var n = 0,
                            i = void 0,
                            r = !1;
                        for (i = 0; i < t.length; i += n) {
                            var o = !0;
                            if (this._inLongSysexMessage) {
                                if (i = this._bufferLongSysex(t, i), 247 != t[i - 1]) return;
                                r = !0
                            } else switch (r = !1, 240 & t[i]) {
                                case 0:
                                    n = 1, o = !1;
                                    break;
                                case 128:
                                case 144:
                                case 160:
                                case 176:
                                case 224:
                                    n = 3;
                                    break;
                                case 192:
                                case 208:
                                    n = 2;
                                    break;
                                case 240:
                                    switch (t[i]) {
                                        case 240:
                                            if (i = this._bufferLongSysex(t, i), 247 != t[i - 1]) return;
                                            r = !0;
                                            break;
                                        case 241:
                                        case 243:
                                            n = 2;
                                            break;
                                        case 242:
                                            n = 3;
                                            break;
                                        default:
                                            n = 1
                                    }
                            }
                            if (o) {
                                var a = {};
                                if (a.receivedTime = parseFloat(e.toString()) + this._jazzInstance._perfTimeZero, r || this._inLongSysexMessage ? (a.data = new Uint8Array(this._sysexBuffer), this._sysexBuffer = new Uint8Array(0), this._inLongSysexMessage = !1) : a.data = new Uint8Array(t.slice(i, n + i)), f) this._onmidimessage && this._onmidimessage(a);
                                else {
                                    var c = new s.MIDIMessageEvent(this, a.data, a.receivedTime);
                                    this.dispatchEvent(c)
                                }
                            }
                        }
                    }
                }, {
                    "./midi_access": 33,
                    "./midiconnection_event": 36,
                    "./midimessage_event": 37,
                    "./util": 39
                }],
                35: [function(e, t, n) {
                    "use strict";
                    var i = function(e, t) {
                            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                        },
                        r = function() {
                            function e(e, t) {
                                for (var n = 0; n < t.length; n++) {
                                    var i = t[n];
                                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
                                }
                            }
                            return function(t, n, i) {
                                return n && e(t.prototype, n), i && e(t, i), t
                            }
                        }();
                    Object.defineProperty(n, "__esModule", {
                        value: !0
                    });
                    var o = e("./util"),
                        s = e("./midi_access"),
                        a = function() {
                            function e(t, n) {
                                i(this, e), this.id = s.getMIDIDeviceId(t[0], "output"), this.name = t[0], this.manufacturer = t[1], this.version = t[2], this.type = "output", this.state = "connected", this.connection = "pending", this.onmidimessage = null, this.onstatechange = null, this._listeners = new Set, this._inLongSysexMessage = !1, this._sysexBuffer = new Uint8Array, this._jazzInstance = n, this._jazzInstance.outputInUse = !0, "linux" === o.getDevice().platform && this._jazzInstance.MidiOutOpen(this.name)
                            }
                            return r(e, [{
                                key: "open",
                                value: function t() {
                                    "open" !== this.connection && ("linux" !== o.getDevice().platform && this._jazzInstance.MidiOutOpen(this.name), this.connection = "open", s.dispatchEvent(this))
                                }
                            }, {
                                key: "close",
                                value: function n() {
                                    "closed" !== this.connection && ("linux" !== o.getDevice().platform && this._jazzInstance.MidiOutClose(), this.connection = "closed", s.dispatchEvent(this), this.onstatechange = null, this._listeners.clear())
                                }
                            }, {
                                key: "send",
                                value: function a(e, t) {
                                    var n = this,
                                        i = 0;
                                    return 0 === e.length ? !1 : (t && (i = Math.floor(t - window.performance.now())), t && i > 1 ? window.setTimeout(function() {
                                        n._jazzInstance.MidiOutLong(e)
                                    }, i) : this._jazzInstance.MidiOutLong(e), !0)
                                }
                            }, {
                                key: "addEventListener",
                                value: function c(e, t, n) {
                                    "statechange" === e && this._listeners.has(t) === !1 && this._listeners.add(t)
                                }
                            }, {
                                key: "removeEventListener",
                                value: function u(e, t, n) {
                                    "statechange" === e && this._listeners.has(t) === !1 && this._listeners["delete"](t)
                                }
                            }, {
                                key: "dispatchEvent",
                                value: function f(e) {
                                    this._listeners.forEach(function(t) {
                                        t(e)
                                    }), null !== this.onstatechange && this.onstatechange(e)
                                }
                            }]), e
                        }();
                    n.MIDIOutput = a
                }, {
                    "./midi_access": 33,
                    "./util": 39
                }],
                36: [function(e, t, n) {
                    "use strict";
                    var i = function(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    };
                    Object.defineProperty(n, "__esModule", {
                        value: !0
                    });
                    var r = function o(e, t) {
                        i(this, o), this.bubbles = !1, this.cancelBubble = !1, this.cancelable = !1, this.currentTarget = e, this.defaultPrevented = !1, this.eventPhase = 0, this.path = [], this.port = t, this.returnValue = !0, this.srcElement = e, this.target = e, this.timeStamp = Date.now(), this.type = "statechange"
                    };
                    n.MIDIConnectionEvent = r
                }, {}],
                37: [function(e, t, n) {
                    "use strict";
                    var i = function(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    };
                    Object.defineProperty(n, "__esModule", {
                        value: !0
                    });
                    var r = function o(e, t, n) {
                        i(this, o), this.bubbles = !1, this.cancelBubble = !1, this.cancelable = !1, this.currentTarget = e, this.data = t, this.defaultPrevented = !1, this.eventPhase = 0, this.path = [], this.receivedTime = n, this.returnValue = !0, this.srcElement = e, this.target = e, this.timeStamp = Date.now(), this.type = "midimessage"
                    };
                    n.MIDIMessageEvent = r
                }, {}],
                38: [function(e, t, n) {
                    "use strict";
                    Object.defineProperty(n, "__esModule", {
                        value: !0
                    });
                    var i = e("./midi_access"),
                        r = e("./util"),
                        o = void 0;
                    ! function() {
                        window.navigator.requestMIDIAccess || (r.polyfill(), window.navigator.requestMIDIAccess = function() {
                            return void 0 === o && (o = i.createMIDIAccess()), o
                        }, r.getDevice().nodejs === !0 && (window.navigator.close = function() {
                            i.closeAllMIDIInputs()
                        }))
                    }()
                }, {
                    "./midi_access": 33,
                    "./util": 39
                }],
                39: [function(e, t, n) {
                    (function(e, t, i) {
                        "use strict";

                        function r() {
                            if (void 0 !== u) return u;
                            var t = "undetected",
                                n = "undetected",
                                r = !1;
                            if (r = "undefined" != typeof i && void 0 !== window.jazzMidi, r === !0) return t = e.platform, u = {
                                platform: t,
                                nodejs: r,
                                mobile: "ios" === t || "android" === t
                            };
                            var o = navigator.userAgent;
                            return o.match(/(iPad|iPhone|iPod)/g) ? t = "ios" : -1 !== o.indexOf("Android") ? t = "android" : -1 !== o.indexOf("Linux") ? t = "linux" : -1 !== o.indexOf("Macintosh") ? t = "osx" : -1 !== o.indexOf("Windows") && (t = "windows"), -1 !== o.indexOf("Chrome") ? (n = "chrome", -1 !== o.indexOf("OPR") ? n = "opera" : -1 !== o.indexOf("Chromium") && (n = "chromium")) : -1 !== o.indexOf("Safari") ? n = "safari" : -1 !== o.indexOf("Firefox") ? n = "firefox" : -1 !== o.indexOf("Trident") && (n = "ie", -1 !== o.indexOf("MSIE 9") && (n = "ie9")), "ios" === t && -1 !== o.indexOf("CriOS") && (n = "chrome"), u = {
                                platform: t,
                                browser: n,
                                mobile: "ios" === t || "android" === t,
                                nodejs: !1
                            }
                        }

                        function o() {
                            void 0 === window.performance && (window.performance = {}), Date.now = Date.now || function() {
                                return (new Date).getTime()
                            }, void 0 === window.performance.now && ! function() {
                                var e = Date.now();
                                void 0 !== window.performance.timing && void 0 !== window.performance.timing.navigationStart && (e = window.performance.timing.navigationStart), window.performance.now = function t() {
                                    return Date.now() - e
                                }
                            }()
                        }

                        function s() {
                            var e = (new Date).getTime(),
                                t = new Array(64).join("x");
                            return t = t.replace(/[xy]/g, function(t) {
                                var n = (e + 16 * Math.random()) % 16 | 0;
                                return e = Math.floor(e / 16), ("x" == t ? n : 3 & n | 8).toString(16).toUpperCase()
                            })
                        }

                        function a(e) {
                            "function" != typeof e.Promise && (e.Promise = function(e) {
                                this.executor = e
                            }, e.Promise.prototype.then = function(e, t) {
                                "function" != typeof e && (e = function() {}), "function" != typeof t && (t = function() {}), this.executor(e, t)
                            })
                        }

                        function c() {
                            var e = r();
                            "ie" === e.browser ? a(window) : e.nodejs === !0 && a(t), o()
                        }
                        Object.defineProperty(n, "__esModule", {
                            value: !0
                        }), n.getDevice = r, n.polyfillPerformance = o, n.generateUUID = s, n.polyfillPromise = a, n.polyfill = c;
                        var u = void 0
                    }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, "/src")
                }, {
                    _process: 31
                }]
            }, {}, [38])
        }).call(this)
    }).call(this), "undefined" == typeof Package && (Package = {}), Package["flowkey:web-midi-api-shim"] = {}
}();

! function() {
    var n = Package.meteor.Meteor,
        t;
    (function() {
        (function() {
            t = function(n) {
                function r(n) {
                    return arguments.length ? (M = n, t) : M
                }

                function e(n) {
                    return arguments.length ? (P = l(n), t) : P
                }

                function l(n) {
                    return "function" == typeof n ? n : function() {
                        return n
                    }
                }

                function u(n) {
                    return arguments.length ? (b = "number" == typeof n ? function(t) {
                        return f(t, n)
                    } : l(n), t) : b
                }

                function o(n) {
                    return arguments.length ? (o = !!n, t) : o
                }

                function a(n, t) {
                    return f(n, Math.ceil(Math.log(t.length) / Math.LN2 + 1))
                }

                function f(n, t) {
                    for (var r = -1, e = +n[0], l = (n[1] - e) / t, u = []; ++r <= t;) u[r] = l * r + e;
                    return u
                }

                function i(n) {
                    return [k(n), p(n)]
                }
                var g = n.data,
                    c = n.bins,
                    h = c.length,
                    s = function(n) {
                        return {
                            left: function(t, r, e, l) {
                                for (arguments.length < 3 && (e = 0), arguments.length < 4 && (l = t.length); l > e;) {
                                    var u = e + l >>> 1;
                                    n.call(t, t[u], u) < r ? e = u + 1 : l = u
                                }
                                return e
                            },
                            right: function(t, r, e, l) {
                                for (arguments.length < 3 && (e = 0), arguments.length < 4 && (l = t.length); l > e;) {
                                    var u = e + l >>> 1;
                                    r < n.call(t, t[u], u) ? l = u : e = u + 1
                                }
                                return e
                            }
                        }
                    },
                    m = s(function(n) {
                        return n
                    }),
                    v = m.left,
                    d = m.right,
                    y = d,
                    k = function(n, t) {
                        var r = -1,
                            e = n.length,
                            l, u;
                        if (1 === arguments.length) {
                            for (; ++r < e && !(null != (l = n[r]) && l >= l);) l = void 0;
                            for (; ++r < e;) null != (u = n[r]) && l > u && (l = u)
                        } else {
                            for (; ++r < e && !(null != (l = t.call(n, n[r], r)) && l >= l);) l = void 0;
                            for (; ++r < e;) null != (u = t.call(n, n[r], r)) && l > u && (l = u)
                        }
                        return l
                    },
                    p = function(n, t) {
                        var r = -1,
                            e = n.length,
                            l, u;
                        if (1 === arguments.length) {
                            for (; ++r < e && !(null != (l = n[r]) && l >= l);) l = void 0;
                            for (; ++r < e;) null != (u = n[r]) && u > l && (l = u)
                        } else {
                            for (; ++r < e && !(null != (l = t.call(n, n[r], r)) && l >= l);) l = void 0;
                            for (; ++r < e;) null != (u = t.call(n, n[r], r)) && u > l && (l = u)
                        }
                        return l
                    },
                    o = !0,
                    M = Number,
                    P = i,
                    b = a;
                u(c);
                for (var u = [], x = g.map(M, this), e = P.call(this, x, h), N = b.call(this, e, x, h), w, h = -1, L = x.length, j = N.length - 1, q = o ? 1 : 1 / L, z; ++h < j;) w = u[h] = [], w.dx = N[h + 1] - (w.x = N[h]), w.y = 0;
                if (j > 0)
                    for (h = -1; ++h < L;) z = x[h], z >= e[0] && z <= e[1] && (w = u[y(N, z, 1, j) - 1], w.y += q, w.push(g[h]));
                return u
            }
        }).call(this)
    }).call(this), "undefined" == typeof Package && (Package = {}), Package["flowkey:histogram"] = {
        histogram: t
    }
}();

! function() {
    var e = Package.meteor.Meteor,
        t = Package["flow-core"].flow,
        a = Package.audiofeatures.CFA,
        s = Package.audiofeatures.Chroma,
        h = Package.audiofeatures.ChromaVar,
        i = Package.audiofeatures.ChromaDiffVar,
        o = Package.audiofeatures.ChromaRange,
        r = Package.audiofeatures.HFC,
        n = Package.audiofeatures.RMS,
        l = Package.audiofeatures.SpectralCentroid,
        f = Package.audiofeatures.SpectralCentroidVar,
        c = Package.audiofeatures.SpectralFlux,
        u = Package.audiofeatures.SpectralFluxVar,
        d = Package.audiofeatures.SpectralRolloff,
        g = Package.audiofeatures.SpectralRolloffVar,
        k = Package.audiofeatures.ZeroCrossingRate,
        m = Package.audiofeatures.ZeroCrossingRateVar,
        y = Package.audiofeatures.Autocorrelation,
        T = Package["flowkey:math-tools"].zArray,
        p = Package["flowkey:math-tools"].linearToDecibel,
        P = Package["flowkey:math-tools"].decibelToLinear,
        B = Package["flowkey:math-tools"].getRmsOfArray,
        w = Package["flowkey:math-tools"].getMaxOfArray,
        v = Package["flowkey:math-tools"].copyArray,
        M = Package["flowkey:math-tools"].getMinOfArray,
        b = Package["flowkey:math-tools"].getSumOfArray,
        C = Package["flowkey:math-tools"].getAbsSumOfArray,
        L = Package["flowkey:math-tools"].centToFrequencyRatio,
        S = Package["flowkey:math-tools"].frequencyRatioToCent,
        F = Package["flowkey:math-tools"].midiToFrequency,
        A = Package["flowkey:math-tools"].frequencyToMidi,
        O = Package["flowkey:math-tools"].calculateBinFromFrequency,
        x = Package["flowkey:math-tools"].calculateFrequencyFromBin,
        D = Package["flowkey:math-tools"].getBin,
        R = Package["flowkey:math-tools"].flashsort,
        E = Package["flowkey:math-tools"].getFreq,
        N = Package["flowkey:math-tools"].mean,
        q = Package["flowkey:math-tools"].median,
        V = Package["flowkey:math-tools"].firstQuartile,
        j = Package["flowkey:math-tools"].thirdQuartile,
        G = Package["flowkey:math-tools"].interQuartileRange,
        Q = Package["flowkey:math-tools"].variance,
        z = Package["flowkey:math-tools"].standardDeviation,
        I = Package["flowkey:math-tools"].createLinearSpace,
        Z = Package["flowkey:math-tools"].calculateMappingElementCountVector,
        H = Package["flowkey:functionstack"].FunctionStack,
        W = Package["flowkey:dsp"].DSP,
        _ = Package["flowkey:dsp"].DFT,
        J = Package["flowkey:dsp"].FFT,
        K = Package["flowkey:dsp"].Oscillator,
        U = Package["flowkey:dsp"].ADSR,
        X = Package["flowkey:dsp"].IIRFilter,
        Y = Package["flowkey:dsp"].MultiDelay,
        $ = Package["flowkey:dsp"].WindowFunction,
        ee = Package["flowkey:histogram"].histogram,
        te = Package.underscore._,
        ae, se;
    (function() {
        var a = e.settings ? e.settings["public"].debug : !0,
            s = function(e) {
                a && console.log(e)
            };
        ae = function(e) {
            var e = e || {},
                a = this;
            a.webaudioManager = e.webaudioManager, a.initAudioGraph(), this.binaryBuffer = new Array(20);
            for (var s = 0; s < this.binaryBuffer.length; s++) this.binaryBuffer[s] = !1;
            this.odfBufferLength = 300, this.odfBuffer = T(this.odfBufferLength), this.threshBuffer = T(this.odfBufferLength), this.diffFactor = .8, this.smallOdfBufferLength = e.thresholdBufferLength || 15, this.defaultMinThreshold = 5e-6, this.minThreshold = this.defaultMinThreshold, this.setupBlocks = 50, this.setupCounter = 0, this.linSpaceLength = 9, this.threshSetupComplete = 0, this.onsetCounter = 0, this.currentOnsetTime = 0, this.trendDetection = 1, this.smallThreshBuffer = [], this.lastThreshold = this.defaultMinThreshold, this.trendLength = 4, this.trend = [], this.currentTrend = 1, this.threshScaling = 0, this.scaleEvery = -100, this.scaleCounter = this.scaleEvery, this.isRunning = !0, this.injections = new H;
            var h = e.eventName || "onset";
            try {
                this.graph = this.webaudioManager.getAudioGraph("onsetDetect"), this.blockLength = this.graph.getNodeSpec("fft-clean").settings.bufferSize
            } catch (i) {}
            this.onsetFeature = new c({
                blockLength: this.blockLength
            });
            var o = t.bind(a.run, a);
            a.webaudioManager.changeAudioGraph("onsetDetect", {
                "fft-clean": {
                    inject: [o]
                }
            }), this.onsetEvent = t.events.create("onsetEvent"), this.onsetEvent.data = {}
        }, te.extend(ae.prototype, {
            run: function(e) {
                var a = this;
                if (a.isRunning) {
                    var h = this.onsetFeature.compute(e);
                    this.odfBuffer.shift(), this.odfBuffer.push(h), this.setupCounter < this.setupBlocks && this.calculateMinThreshold();
                    var i = this.odfBuffer.slice(this.odfBufferLength - this.smallOdfBufferLength, this.odfBufferLength),
                        o = this.computeOdfThreshold(i, this.minThreshold);
                    this.threshBuffer.shift(), this.threshBuffer.push(o.threshold);
                    var r = !0,
                        n = window.performance.now();
                    n - this.currentOnsetTime < 164 && (r = !1), this.peakPicking(o.threshold) && r ? (s("--------- Onset ---------"), this.binaryBuffer.shift(), this.binaryBuffer.push(!0), this.onsetCounter++, this.currentOnsetTime = window.performance.now(), this.onsetEvent.data.time = this.currentOnsetTime, this.onsetEvent.data.count = this.onsetCounter, t.events.dispatchEvent(this.onsetEvent)) : (this.binaryBuffer.shift(), this.binaryBuffer.push(!1)), this.injections.runAll({
                        odfBuffer: this.odfBuffer,
                        smallOdfBuffer: i,
                        threshBuffer: this.threshBuffer,
                        binaryBuffer: this.binaryBuffer,
                        currentTrend: this.currentTrend
                    })
                }
            },
            calculateMinThreshold: function() {
                if (this.setupCounter++, this.setupCounter == this.setupBlocks) {
                    var e = this.odfBuffer.slice(this.odfBuffer.length - this.setupBlocks, this.odfBuffer.length),
                        t = [];
                    te.each(e, function(e, a, s) {
                        e > 0 && t.push(e)
                    });
                    var a = 0;
                    te.each(t, function(e, t, s) {
                        a += e
                    });
                    var h = w(t),
                        i = I(0, h, this.linSpaceLength),
                        o = ee({
                            data: t,
                            bins: i
                        }),
                        r = .9;
                    this.minThreshold = this.minThresholdDeterminiation(o, r), this.minThreshold = Math.max(this.minThreshold, this.defaultMinThreshold), isNaN(this.minThreshold) && (console.warn("[OnsetDetection] minThreshold result from histogram is NaN"), this.minThreshold = this.defaultMinThreshold), s("final minThreshold", this.minThreshold), this.lastThreshold = this.minThreshold, this.calculatedMinThreshold = this.minThreshold, this.threshSetupComplete = 1, s("setup check ready")
                }
            },
            minThresholdDeterminiation: function(e, t) {
                for (var a = 0, h = 0; h < e.length; h++) a += e[h].length;
                for (var i = Math.round(.5 * a), o = 0, r, h = 0; h < e.length; h++)
                    if (o += e[h].length, s("histogram sample counter / absoluteTarget: " + o + "/" + i), o >= i) {
                        r = h + 1;
                        break
                    }
                return s("minThreshold bin limit", r), r * e[0].dx
            },
            computeOdfThreshold: function(e, t) {
                var a = N(e),
                    s = q(v(e)),
                    h = 0;
                return h = a + 2 * s, h = Math.max(h, this.minThreshold), this.trendDetection && (h = this.threshTrend(h)), this.threshScaling && this.minThreshScaling(), {
                    mean: a,
                    median: s,
                    threshold: h
                }
            },
            threshTrend: function(e) {
                if (this.smallThreshBuffer.push(e), 3 === this.smallThreshBuffer.length) {
                    var t = N(this.smallThreshBuffer);
                    this.lastThreshold > t ? this.currentTrend = -1 : this.currentTrend = 1, this.lastThreshMean = this.lastThreshold, this.lastThreshold = t, this.smallThreshBuffer = []
                }
                return e = -1 === this.currentTrend ? .75 * e : Math.min(.8 * this.lastThreshMean, 1.1 * e)
            },
            minThreshScaling: function() {
                if (this.scaleCounter++, 0 === this.scaleCounter) {
                    s("Scaling the Threshold");
                    var e = this.odfBuffer.slice(this.odfBufferLength - -1 * this.scaleEvery, this.odfBufferLength),
                        t = w(e);
                    if (this.lastMax) {
                        var a = t / this.lastMax;
                        a * this.minThreshold < 4 * this.calculatedMinThreshold ? this.minThreshold = Math.max(this.calculatedMinThreshold, a * this.minThreshold) : this.minThreshold = 4 * this.calculatedMinThreshold
                    }
                    this.lastMax = t, this.scaleCounter = this.scaleEvery
                }
                se = Math.max(this.minThreshold, se)
            },
            peakPicking: function(e) {
                return this.localMaximum() && this.aboveThreshold(e) ? !0 : !1
            },
            localMaximum: function() {
                return this.odfBuffer[this.odfBufferLength - 3] < this.odfBuffer[this.odfBufferLength - 2] && this.odfBuffer[this.odfBufferLength - 2] > this.odfBuffer[this.odfBufferLength - 1] ? !0 : !1
            },
            aboveThreshold: function(e) {
                return this.odfBuffer[this.odfBufferLength - 2] > e ? !0 : !1
            },
            inject: function(e) {
                this.injections.add(e)
            }
        })
    }).call(this),
        function() {
            te.extend(ae.prototype, {
                initAudioGraph: function() {
                    var e = this.webaudioManager.nodeLibrary;
                    e.clone("gain", "gain-clean", {
                        gain: 0
                    }), e.clone("coAnalyser", "fft-clean", {
                        sampleRate: function() {
                            return this.audioContext.sampleRate
                        }
                    }), e.clone("analyser", "analyser-clean", {}), this.webaudioManager.createAudioGraph("onsetDetect", {
                        microphone: {},
                        "analyser-clean": {
                            smoothingTimeConstant: 0
                        },
                        "fft-clean": {
                            analyserNodeName: "analyser-clean"
                        },
                        "gain-clean": {
                            gain: 0
                        }
                    })
                }
            })
        }.call(this), "undefined" == typeof Package && (Package = {}), Package["onset-detection"] = {
            OnsetDetection: ae
        }
}();

! function() {
    var t = Package.meteor.Meteor,
        e = Package["flow-core"].flow,
        n = Package["note-detection"].NoteDetection,
        o = Package.ecmascript.ECMAScript,
        r = Package["flowkey:math-tools"].zArray,
        i = Package["flowkey:math-tools"].linearToDecibel,
        a = Package["flowkey:math-tools"].decibelToLinear,
        s = Package["flowkey:math-tools"].getRmsOfArray,
        c = Package["flowkey:math-tools"].getMaxOfArray,
        u = Package["flowkey:math-tools"].copyArray,
        l = Package["flowkey:math-tools"].getMinOfArray,
        h = Package["flowkey:math-tools"].getSumOfArray,
        f = Package["flowkey:math-tools"].getAbsSumOfArray,
        p = Package["flowkey:math-tools"].centToFrequencyRatio,
        y = Package["flowkey:math-tools"].frequencyRatioToCent,
        g = Package["flowkey:math-tools"].midiToFrequency,
        m = Package["flowkey:math-tools"].frequencyToMidi,
        v = Package["flowkey:math-tools"].calculateBinFromFrequency,
        d = Package["flowkey:math-tools"].calculateFrequencyFromBin,
        k = Package["flowkey:math-tools"].getBin,
        w = Package["flowkey:math-tools"].flashsort,
        E = Package["flowkey:math-tools"].getFreq,
        P = Package["flowkey:math-tools"].mean,
        C = Package["flowkey:math-tools"].median,
        F = Package["flowkey:math-tools"].firstQuartile,
        D = Package["flowkey:math-tools"].thirdQuartile,
        S = Package["flowkey:math-tools"].interQuartileRange,
        b = Package["flowkey:math-tools"].variance,
        T = Package["flowkey:math-tools"].standardDeviation,
        x = Package["flowkey:math-tools"].createLinearSpace,
        _ = Package["flowkey:math-tools"].calculateMappingElementCountVector,
        M = Package["ephemer:reactive-array"].ReactiveArray,
        A = Package["flowkey:functionstack"].FunctionStack,
        B = Package["flowkey:dsp"].DSP,
        I = Package["flowkey:dsp"].DFT,
        N = Package["flowkey:dsp"].FFT,
        O = Package["flowkey:dsp"].Oscillator,
        R = Package["flowkey:dsp"].ADSR,
        L = Package["flowkey:dsp"].IIRFilter,
        q = Package["flowkey:dsp"].MultiDelay,
        K = Package["flowkey:dsp"].WindowFunction,
        j = Package.underscore._,
        H = Package["reactive-var"].ReactiveVar,
        Q = Package["onset-detection"].OnsetDetection,
        V = Package["babel-runtime"].babelHelpers,
        z = Package["ecmascript-runtime"].Symbol,
        W = Package["ecmascript-runtime"].Map,
        G = Package["ecmascript-runtime"].Set,
        J = Package.promise.Promise,
        U, X, Y, Z, $, tt, et, nt, ot, rt, it;
    (function() {
        U = function() {
            function t(e, n) {
                V.classCallCheck(this, t), this.inputManager = n, this.helper = e, this.followEvents = !0, this.isRunning = new H(!1), this.injections = new A
            }
            return t.prototype._process = function() {
                function t(t) {
                    console.error("not implemented")
                }
                return t
            }(), t.prototype._makeDecision = function() {
                function t(t) {
                    console.error("not implemented")
                }
                return t
            }(), t.prototype.start = function() {
                function t() {
                    this.inputManager.start(), this.isRunning.set(!0)
                }
                return t
            }(), t.prototype.stop = function() {
                function t() {
                    this.inputManager.stop(), this.isRunning.set(!1)
                }
                return t
            }(), t.prototype.loadSource = function() {
                function t() {
                    this.inputManager.loadSource()
                }
                return t
            }(), t.prototype.unloadSource = function() {
                function t() {
                    this.inputManager.unloadSource()
                }
                return t
            }(), t.prototype.inject = function() {
                function t(t) {
                    this.injections.add(t)
                }
                return t
            }(), t.prototype.getCurrentEventData = function() {
                function t() {
                    return this.helper.getCurrentEventData()
                }
                return t
            }(), t.prototype._run = function() {
                function t(t) {
                    var e = this._process(t);
                    this.followEvents && this._makeDecision(e), this.injections.runAll(e)
                }
                return t
            }(), t.prototype._next = function() {
                function t() {
                    this.helper.next()
                }
                return t
            }(), t
        }()
    }).call(this),
        function() {
            X = function() {
                function t() {
                    V.classCallCheck(this, t), this.eventData = new H, this.currentEvent = new H, this.currentEventData = {}, this.timer = [], this.nextExpected = e.events.create("nextExpected"), this.nextExpected.data = {}, this.followEvent = e.events.create("follow")
                }
                return t.prototype.setEvents = function() {
                    function t(t) {
                        t && (t = this.setSubsets(t)), this.eventData.set(t)
                    }
                    return t
                }(), t.prototype.getEvents = function() {
                    function t() {
                        return this.eventData.get()
                    }
                    return t
                }(), t.prototype.getCurrentEvent = function() {
                    function t() {
                        return this.currentEvent.get()
                    }
                    return t
                }(), t.prototype.getCurrentEventData = function() {
                    function t() {
                        var t = this.currentEvent.get(),
                            e = this.eventData.get();
                        if ("undefined" == typeof t || "undefined" == typeof e) return !1;
                        var n = e[t];
                        return n
                    }
                    return t
                }(), t.prototype.setCurrentEvent = function() {
                    function t(t) {
                        this.currentEvent.set(t), this.currentEventData = this.getCurrentEventData(), this.next(!0)
                    }
                    return t
                }(), t.prototype.next = function() {
                    function t(t) {
                        t || this.currentEvent.set(this.currentEvent.get() + 1);
                        var e = this._findNextExisting();
                        e && this.throwExpected(e), this.throwFollowEvent(e)
                    }
                    return t
                }(), t.prototype.throwFollowEvent = function() {
                    function t(t) {
                        this.followEvent.data = {
                            nextEventNumber: this.currentEvent.get(),
                            nextEvent: t
                        }, e.events.dispatchEvent(this.followEvent)
                    }
                    return t
                }(), t.prototype._findNextExisting = function() {
                    function t() {
                        var t = this.getCurrentEventData();
                        return t && 0 == t.notes.length ? (this.next(), !1) : t
                    }
                    return t
                }(), t.prototype.throwExpected = function() {
                    function t(t) {
                        if (!t) var n = this.getCurrentEventData();
                        t && (this.nextExpected.data.event = t, e.events.dispatchEvent(this.nextExpected))
                    }
                    return t
                }(), t.prototype.start = function() {
                    function t() {
                        this.next(!0)
                    }
                    return t
                }(), t.prototype.isSubset = function() {
                    function t(t, e) {
                        var n = j.map(t, function(t, n) {
                            return t == e[n] || e[n] < t
                        });
                        return !j.contains(n, !1)
                    }
                    return t
                }(), t.prototype.setSubsets = function() {
                    function t(t) {
                        var e = this,
                            n = t,
                            o = void 0;
                        return j.each(t, function(t, e) {
                            t.notes.length > 0 && void 0 === o && (o = e)
                        }), j.each(t, function(t, i) {
                            var a = 1,
                                s = void 0,
                                c = void 0;
                            if (i > o) {
                                for (; !c && 40 > a;) s = n[i - a], c = s.notes.length, a++;
                                n[i].subset = e.isSubset(n[i - (a - 1)].expChroma, n[i].expChroma)
                            } else n[i].subset = !1;
                            n[i].subset && c && ! function() {
                                var t = !1,
                                    e = r(12),
                                    o = 0;
                                j(n[i].notes).each(function(n) {
                                    var r = !1;
                                    j(s.notes).each(function(t) {
                                        n.pitch === t.pitch && (o++, e[n.pitch] = 1, n.subset = !0), n.octave === t.octave && (r = !0)
                                    }), 1 === o && r === !0 && (t = !0)
                                }), o > 0 && (n[i].subset = !0), n[i].subsetBinary = e, n[i].identicalSubset = t
                            }()
                        }), n
                    }
                    return t
                }(), t
            }()
        }.call(this),
        function() {
            Y = function() {
                function t(n) {
                    var o = this;
                    V.classCallCheck(this, t), this.openStatus = new H(!1), this.time = n || void 0, this.closeTimer = new e(function() {
                        o.openStatus.set(!1)
                    })
                }
                return t.prototype.status = function() {
                    function t() {
                        return this.openStatus.get()
                    }
                    return t
                }(), t.prototype.open = function() {
                    function t(t) {
                        t = t || this.time, this.openStatus.set(!0), t && (this.closeTimer && this.closeTimer.stop(), this.closeTimer.start(t))
                    }
                    return t
                }(), t.prototype.reset = function() {
                    function t() {
                        this.closeTimer.stop(), this.openStatus.set(!1)
                    }
                    return t
                }(), t
            }();
            var e = function() {
                function e(n) {
                    var o = this;
                    if (V.classCallCheck(this, e), this.timerInstance, !j.isFunction(n)) throw new t.Error(888, "Error 888: No Function given for timer");
                    this.callback = function() {
                        n(), o.stop()
                    }
                }
                return e.prototype.start = function() {
                    function t(t) {
                        this.timerInstance ? (this.stop(), this.start(t)) : this.timerInstance = setTimeout(this.callback, t)
                    }
                    return t
                }(), e.prototype.stop = function() {
                    function t() {
                        clearTimeout(this.timerInstance), this.timerInstance = void 0
                    }
                    return t
                }(), e
            }()
        }.call(this),
        function() {
            Z = function() {
                function n() {
                    V.classCallCheck(this, n), this.lastDetectedChroma = new r(12), this.lastDetectedNotes = [], t.isCordova ? (this.timeToFade = 2500, this.defaultTolerance = .75, this.identicalSubsetTolerance = .75) : (this.timeToFade = 4e3, this.defaultTolerance = .55, this.identicalSubsetTolerance = .55), this.timeFactor = 1, this.someParameterIdontKnowHowToName = .8, this.lastEventTime = 0
                }
                return n.prototype.run = function() {
                    function t(t, n) {
                        if (!t || !n || !this.lastDetectedChroma) return e.log(2, "some data is missing, returning true"), !0;
                        var o = window.performance.now() - this.lastEventTime;
                        if (o > this.timeToFade) return !0;
                        var r = t.subsetBinary;
                        n = numeric.mul(n, r);
                        var i = numeric.mul(this.lastDetectedChroma, r),
                            a = this.lastDetectedNotes.length;
                        a > 1 && (i = numeric.div(i, this.someParameterIdontKnowHowToName * a));
                        var s = t.identicalSubset ? this.identicalSubsetTolerance : this.defaultTolerance;
                        s = this.timeFactor * s;
                        var c = numeric.mul(i, s),
                            u = numeric.sub(n, c),
                            l = j.every(u, function(t) {
                                return t >= 0
                            });
                        return e.log(1, "[Follower] Sufficient Energy: " + l), l
                    }
                    return t
                }(), n.prototype.saveChromaAndNotes = function() {
                    function t(t, e) {
                        var n = window.performance.now();
                        this.lastEventTime = n, this.lastDetectedChroma = t, this.lastDetectedNotes = e
                    }
                    return t
                }(), n
            }()
        }.call(this),
        function() {
            $ = function() {
                function t() {
                    V.classCallCheck(this, t), this.array = []
                }
                return t.prototype.add = function() {
                    function t(t) {
                        this.contains(t) || this.array.push(t)
                    }
                    return t
                }(), t.prototype.remove = function() {
                    function t(t) {
                        this.array = j.without(this.array, t)
                    }
                    return t
                }(), t.prototype.contains = function() {
                    function t(t) {
                        return j.contains(this.array, t)
                    }
                    return t
                }(), t.prototype.reset = function() {
                    function t() {
                        this.array = []
                    }
                    return t
                }(), t
            }()
        }.call(this),
        function() {
            tt = function(n) {
                function o(r, i) {
                    V.classCallCheck(this, o), n.call(this, r, i);
                    var a = t.isCordova ? 600 : 400;
                    this.newEventBlocker = new Y(500), this.onsetBlocker = new Y(a), this.noteBlocker = new Y(300), this.energyCheck = new Z, e.events.listen("onsetEvent", e.bind(this._onsetListening, this)), e.events.listen("noteStatus", e.bind(this._noteListening, this))
                }
                return V.inherits(o, n), o.prototype._getInputManager = function() {
                    function t() {
                        return e.audioManager.get()
                    }
                    return t
                }(), o.prototype._process = function() {
                    function t(t) {
                        return t
                    }
                    return t
                }(), o.prototype._makeDecision = function() {
                    function t(t) {
                        var e = this.getCurrentEventData(),
                            o = this.newEventBlocker.status(),
                            r = this.onsetBlocker.status(),
                            i = this.noteBlocker.status();
                        if (!o && i && r) {
                            if (e && e.subset) {
                                var a = this.energyCheck.run(e, this.currentChroma);
                                if (!a) return
                            }
                            this._resetState(), n.prototype._next.call(this)
                        }
                    }
                    return t
                }(), o.prototype._resetState = function() {
                    function t() {
                        this.energyCheck.saveChromaAndNotes(this.currentChroma, this.currentNotes), this.onsetBlocker.reset(), this.noteBlocker.reset(), this.newEventBlocker.open()
                    }
                    return t
                }(), o.prototype._onsetListening = function() {
                    function t(t) {
                        this.onsetBlocker.status() || (this.currentOnsetTime = window.performance.now(), this.onsetBlocker.open(), this._run())
                    }
                    return t
                }(), o.prototype._noteListening = function() {
                    function t(t) {
                        this.currentChroma = t.data.chroma, this.currentNotes = t.data.notes, this.noteBlocker.open(), this._run()
                    }
                    return t
                }(), o
            }(U)
        }.call(this),
        function() {
            et = function(t) {
                function n(o, r) {
                    V.classCallCheck(this, n), t.call(this, o, r), this._midiKeyArray = new $, e.events.listen("midiMessage", e.bind(this._midiListening, this))
                }
                return V.inherits(n, t), n.prototype._getInputManager = function() {
                    function t() {
                        return e.midiManager.get()
                    }
                    return t
                }(), n.prototype._makeDecision = function() {
                    function t() {
                        var t = this,
                            e = this.getCurrentEventData();
                        if (e) {
                            var n = [];
                            j.each(e.notes, function(e, o, r) {
                                n.push(t._midiKeyArray.contains(e.key))
                            }), j.every(n) && (this._midiKeyArray.reset(), this._next())
                        }
                    }
                    return t
                }(), n.prototype._process = function() {
                    function t(t) {
                        var e = t[0] >> 4,
                            n = 15 & t[0],
                            o = t[1],
                            r = 0;
                        t.length > 2 && (r = t[2]);
                        var i = "";
                        return i = 8 == e || 9 == e && 0 == r ? "noteOff" : 9 == e ? "noteOn" : "not interpreted", "noteOff" == i ? this._midiKeyArray.remove(o) : "noteOn" == i && this._midiKeyArray.add(o), {
                            command: i,
                            channel: n,
                            key: o,
                            velocity: r
                        }
                    }
                    return t
                }(), n.prototype._midiListening = function() {
                    function t(t) {
                        this.isRunning.get() && this._run(t.data)
                    }
                    return t
                }(), n
            }(U)
        }.call(this),
        function() {
            nt = function() {
                function t() {
                    var n, o, r = this,
                        i = arguments.length <= 0 || void 0 === arguments[0] ? (n = {}, ot = n.followerMode, o = n.onInit, rt = void 0 === o ? function() {} : o, n) : arguments[0];
                    V.classCallCheck(this, t), this.helper = new X, this.activeFollower = void 0, this.audioFollower = new it(this.helper, e.audioManager), this.midiFollower = new et(this.helper, e.midiManager), this.followerMode = new H, this.onInit = rt, Tracker.autorun(function() {
                        var t = e.inputManager.inputType.get();
                        if (t) {
                            if (Tracker.nonreactive(function() {
                                    var t = e.player.pSm;
                                    t && !t.is("paused") && t.can("pause") && t.pause()
                                }), "midi" === t) r.activeFollower = r.midiFollower;
                            else {
                                if ("audio" !== t) return void e.log(3, "follower inputType not valid");
                                r.activeFollower = r.audioFollower
                            }
                            r.followerMode.set(t)
                        }
                    })
                }
                return t.prototype.get = function() {
                    function t() {
                        return this
                    }
                    return t
                }(), t.prototype.init = function() {
                    function t() {
                        this.onInit && this.onInit()
                    }
                    return t
                }(), t.prototype.start = function() {
                    function t() {
                        this.helper.start(), this.activeFollower.start()
                    }
                    return t
                }(), t.prototype.stop = function() {
                    function t() {
                        this.activeFollower.stop()
                    }
                    return t
                }(), t.prototype.loadSource = function() {
                    function t() {
                        this.activeFollower.loadSource()
                    }
                    return t
                }(), t.prototype.unloadSource = function() {
                    function t() {
                        this.activeFollower.unloadSource()
                    }
                    return t
                }(), t.prototype.followEvents = function() {
                    function t() {
                        var t = arguments.length <= 0 || void 0 === arguments[0] ? !0 : arguments[0];
                        this.audioFollower.followEvents = t, this.midiFollower.followEvents = t
                    }
                    return t
                }(), t.prototype.getCurrentEvent = function() {
                    function t() {
                        return this.helper.currentEvent.get()
                    }
                    return t
                }(), t.prototype.setCurrentEvent = function() {
                    function t(t) {
                        this.helper.setCurrentEvent(t)
                    }
                    return t
                }(), t.prototype.getCurrentEventData = function() {
                    function t() {
                        return this.helper.getCurrentEventData()
                    }
                    return t
                }(), t.prototype.setEvents = function() {
                    function t(t) {
                        var e = n.prepareEvents(t);
                        this.helper.setEvents(e)
                    }
                    return t
                }(), t.prototype.getEvents = function() {
                    function t() {
                        return this.helper.getEvents()
                    }
                    return t
                }(), t.prototype.throwExpected = function() {
                    function t() {
                        this.helper.throwExpected()
                    }
                    return t
                }(), t.prototype.next = function() {
                    function t() {
                        this.helper.next()
                    }
                    return t
                }(), t.prototype.getBlockerStatus = function() {
                    function t(t) {
                        var n = this.activeFollower[t + "Blocker"];
                        return n ? n.status() : (e.log("[Follower] no blocker with name: " + t), null)
                    }
                    return t
                }(), t
            }()
        }.call(this),
        function() {
            it = function(t) {
                function e(o, r) {
                    V.classCallCheck(this, e), t.call(this, o, r), this.noteDetection = new n({
                        similarityThreshold: .7,
                        webaudioManager: this.inputManager
                    }), this.onsetDetection = new Q({
                        webaudioManager: this.inputManager
                    })
                }
                return V.inherits(e, t), e
            }(tt)
        }.call(this), "undefined" == typeof Package && (Package = {}), Package.follower = {
            FollowerController: nt
        }
}();

! function() {
    var e = Package.meteor.Meteor,
        i;
    (function() {
        (function() {
            i = function() {
                function e(e) {
                    function o(i) {
                        var o = e.match(i);
                        return o && o.length > 1 && o[1] || ""
                    }

                    function s(i) {
                        var o = e.match(i);
                        return o && o.length > 1 && o[2] || ""
                    }
                    var r = o(/(ipod|iphone|ipad)/i).toLowerCase(),
                        n = /like android/i.test(e),
                        a = !n && /android/i.test(e),
                        t = /CrOS/.test(e),
                        d = o(/edge\/(\d+(\.\d+)?)/i),
                        m = o(/version\/(\d+(\.\d+)?)/i),
                        v = /tablet/i.test(e),
                        c = !v && /[^-]mobi/i.test(e),
                        b;
                    /opera|opr/i.test(e) ? b = {
                        name: "Opera",
                        opera: i,
                        version: m || o(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)
                    } : /yabrowser/i.test(e) ? b = {
                        name: "Yandex Browser",
                        yandexbrowser: i,
                        version: m || o(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)
                    } : /windows phone/i.test(e) ? (b = {
                        name: "Windows Phone",
                        windowsphone: i
                    }, d ? (b.msedge = i, b.version = d) : (b.msie = i, b.version = o(/iemobile\/(\d+(\.\d+)?)/i))) : /msie|trident/i.test(e) ? b = {
                        name: "Internet Explorer",
                        msie: i,
                        version: o(/(?:msie |rv:)(\d+(\.\d+)?)/i)
                    } : t ? b = {
                        name: "Chrome",
                        chromeBook: i,
                        chrome: i,
                        version: o(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
                    } : /chrome.+? edge/i.test(e) ? b = {
                        name: "Microsoft Edge",
                        msedge: i,
                        version: d
                    } : /chrome|crios|crmo/i.test(e) ? b = {
                        name: "Chrome",
                        chrome: i,
                        version: o(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
                    } : r ? (b = {
                        name: "iphone" == r ? "iPhone" : "ipad" == r ? "iPad" : "iPod"
                    }, m && (b.version = m)) : /sailfish/i.test(e) ? b = {
                        name: "Sailfish",
                        sailfish: i,
                        version: o(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
                    } : /seamonkey\//i.test(e) ? b = {
                        name: "SeaMonkey",
                        seamonkey: i,
                        version: o(/seamonkey\/(\d+(\.\d+)?)/i)
                    } : /firefox|iceweasel/i.test(e) ? (b = {
                        name: "Firefox",
                        firefox: i,
                        version: o(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)
                    }, /\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(e) && (b.firefoxos = i)) : /silk/i.test(e) ? b = {
                        name: "Amazon Silk",
                        silk: i,
                        version: o(/silk\/(\d+(\.\d+)?)/i)
                    } : a ? b = {
                        name: "Android",
                        version: m
                    } : /phantom/i.test(e) ? b = {
                        name: "PhantomJS",
                        phantom: i,
                        version: o(/phantomjs\/(\d+(\.\d+)?)/i)
                    } : /blackberry|\bbb\d+/i.test(e) || /rim\stablet/i.test(e) ? b = {
                        name: "BlackBerry",
                        blackberry: i,
                        version: m || o(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
                    } : /(web|hpw)os/i.test(e) ? (b = {
                        name: "WebOS",
                        webos: i,
                        version: m || o(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
                    }, /touchpad\//i.test(e) && (b.touchpad = i)) : b = /bada/i.test(e) ? {
                        name: "Bada",
                        bada: i,
                        version: o(/dolfin\/(\d+(\.\d+)?)/i)
                    } : /tizen/i.test(e) ? {
                        name: "Tizen",
                        tizen: i,
                        version: o(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || m
                    } : /safari/i.test(e) ? {
                        name: "Safari",
                        safari: i,
                        version: m
                    } : {
                        name: o(/^(.*)\/(.*) /),
                        version: s(/^(.*)\/(.*) /)
                    }, !b.msedge && /(apple)?webkit/i.test(e) ? (b.name = b.name || "Webkit", b.webkit = i, !b.version && m && (b.version = m)) : !b.opera && /gecko\//i.test(e) && (b.name = b.name || "Gecko", b.gecko = i, b.version = b.version || o(/gecko\/(\d+(\.\d+)?)/i)), b.msedge || !a && !b.silk ? r && (b[r] = i, b.ios = i) : b.android = i;
                    var l = "";
                    b.windowsphone ? l = o(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i) : r ? (l = o(/os (\d+([_\s]\d+)*) like mac os x/i), l = l.replace(/[_\s]/g, ".")) : a ? l = o(/android[ \/-](\d+(\.\d+)*)/i) : b.webos ? l = o(/(?:web|hpw)os\/(\d+(\.\d+)*)/i) : b.blackberry ? l = o(/rim\stablet\sos\s(\d+(\.\d+)*)/i) : b.bada ? l = o(/bada\/(\d+(\.\d+)*)/i) : b.tizen && (l = o(/tizen[\/\s](\d+(\.\d+)*)/i)), l && (b.osversion = l);
                    var f = l.split(".")[0];
                    return v || "ipad" == r || a && (3 == f || 4 == f && !c) || b.silk ? b.tablet = i : (c || "iphone" == r || "ipod" == r || a || b.blackberry || b.webos || b.bada) && (b.mobile = i), b.msedge || b.msie && b.version >= 10 || b.yandexbrowser && b.version >= 15 || b.chrome && b.version >= 20 || b.firefox && b.version >= 20 || b.safari && b.version >= 6 || b.opera && b.version >= 10 || b.ios && b.osversion && b.osversion.split(".")[0] >= 6 || b.blackberry && b.version >= 10.1 ? b.a = i : b.msie && b.version < 10 || b.chrome && b.version < 20 || b.firefox && b.version < 20 || b.safari && b.version < 6 || b.opera && b.version < 10 || b.ios && b.osversion && b.osversion.split(".")[0] < 6 ? b.c = i : b.x = i, b
                }
                var i = !0,
                    o = e("undefined" != typeof navigator ? navigator.userAgent : "");
                return o.test = function(e) {
                    for (var i = 0; i < e.length; ++i) {
                        var s = e[i];
                        if ("string" == typeof s && s in o) return !0
                    }
                    return !1
                }, o._detect = e, o
            }()
        }).call(this)
    }).call(this), "undefined" == typeof Package && (Package = {}), Package["flowkey:bowser"] = {
        bowser: i
    }
}();

! function() {
    var e = Package.meteor.Meteor,
        s = Package.tracker.Tracker,
        t = Package.tracker.Deps,
        i = Package["accounts-base"].Accounts,
        n = Package["accounts-base"].AccountsClient,
        c = Package.underscore._,
        o;
    (function() {
        (function() {
            function t() {
                var e = !1,
                    t = new s.Dependency;
                this.onLoad = function() {
                    e = !0, t.changed()
                }, this.isReady = function() {
                    return t.depend(), e
                }
            }
            window._kmq = [], o = window._kmq;
            var i = function(s) {
                    e.setTimeout(function() {
                        var e = document,
                            t = e.getElementsByTagName("script")[0],
                            i = e.createElement("script");
                        i.type = "text/javascript", i.async = !0, i.src = s, t.parentNode.insertBefore(i, t)
                    }, 1)
                },
                n = new t,
                a = c.once(function() {
                    o.push(["record", "Login App"])
                });
            e.settings && void 0 !== e.settings["public"] && void 0 !== e.settings["public"].kissmetrics && void 0 !== e.settings["public"].kissmetrics.key ? (i("//i.kissmetrics.com/i.js"), i("//doug1izaerwt3.cloudfront.net/" + e.settings["public"].kissmetrics.key + ".1.js"), o.push(n.onLoad), s.autorun(function() {
                n.isReady() && (o.push = window._kmq.push), e.settings["public"].kissmetrics.autoIdentify === !0 && e.userId() && (o.push(["identify", e.userId()]), a())
            })) : o.push = function() {
                console.log("Your KISSmetrics key is missing from your settings, please set it in your settings file")
            }
        }).call(this)
    }).call(this), "undefined" == typeof Package && (Package = {}), Package["smowden:kissmetrics"] = {
        _kmq: o
    }
}();

! function() {
    var e = Package.meteor.Meteor,
        t = Package.ecmascript.ECMAScript,
        n = Package.templating.Template,
        o = Package["reactive-var"].ReactiveVar,
        i = Package.underscore._,
        a = Package.session.Session,
        r = Package.tracker.Tracker,
        s = Package.tracker.Deps,
        l = Package["flowkey:callback-list"].CallbackList,
        c = Package["flowkey:state-machine"].StateMachine,
        u = Package["flowkey:settings-manager"].SettingsManager,
        d = Package["nerdmed:ios-popover"].IosPopover,
        p = Package["flowkey:hotkeys"].Hotkeys,
        h = Package["ephemer:css3d"].css3d,
        f = Package["nerdmed:zevent"].zEvent,
        g = Package["nerdmed:zevent"].zEventTarget,
        v = Package["flow-core"].flow,
        m = Package.follower.FollowerController,
        y = Package["flowkey:bowser"].bowser,
        w = Package["smowden:kissmetrics"]._kmq,
        k = Package["babel-runtime"].babelHelpers,
        b = Package["ecmascript-runtime"].Symbol,
        S = Package["ecmascript-runtime"].Map,
        M = Package["ecmascript-runtime"].Set,
        T = Package.promise.Promise,
        P = Package.blaze.Blaze,
        I = Package.blaze.UI,
        L = Package.blaze.Handlebars,
        x = Package.spacebars.Spacebars,
        A = Package.htmljs.HTML,
        H, _, D, F, V, C, E, z, B, N, W, O, U, R, Y, K, X, q, j, G, Q, Z, J, ee, te, ne, oe, ie, ae, re, se, le, ce, ue, de, pe, he, fe, ge, ve, me, ye, we, ke, be, Se, Me, Te, v;
    (function() {
        v.binarySearch = function() {
            var e, t, n;
            return function(o, i) {
                for (t = -1, e = o.length; e - t > 1;) o[n = e + t >> 1] <= i ? t = n : e = n;
                return e
            }
        }(), H = function(e, t) {
            this.x = e, this.y = t, this.lastIndex = e.length - 1;
            var n, o, i = this.x.length;
            this.interpolate = function(e) {
                return e ? (o = v.binarySearch(this.x, e), n = o - 1, (e - this.x[n]) * (this.y[o] - this.y[n]) / (this.x[o] - this.x[n]) + this.y[n]) : 0
            }
        }, _ = function() {
            function e(e, t) {
                var n, o, i, a, r, s, l, c, u, d, p, h, f, g, v, m, y;
                for (l = e.length, i = [], s = [], n = [], o = [], a = [], c = [], r = 0, g = l - 1; g >= 0 ? g > r : r > g; g >= 0 ? r += 1 : r -= 1) i[r] = (t[r + 1] - t[r]) / (e[r + 1] - e[r]), r > 0 && (s[r] = (i[r - 1] + i[r]) / 2);
                for (s[0] = i[0], s[l - 1] = i[l - 2], u = [], r = 0, v = l - 1; v >= 0 ? v > r : r > v; v >= 0 ? r += 1 : r -= 1) 0 === i[r] && u.push(r);
                for (d = 0, h = u.length; h > d; d++) r = u[d], s[r] = s[r + 1] = 0;
                for (r = 0, m = l - 1; m >= 0 ? m > r : r > m; m >= 0 ? r += 1 : r -= 1) n[r] = s[r] / i[r], o[r] = s[r + 1] / i[r], a[r] = Math.pow(n[r], 2) + Math.pow(o[r], 2), c[r] = 3 / Math.sqrt(a[r]);
                for (u = [], r = 0, y = l - 1; y >= 0 ? y > r : r > y; y >= 0 ? r += 1 : r -= 1) a[r] > 9 && u.push(r);
                for (p = 0, f = u.length; f > p; p++) r = u[p], s[r] = c[r] * n[r] * i[r], s[r + 1] = c[r] * o[r] * i[r];
                this.x = e.slice(0, l), this.y = t.slice(0, l), this.m = s
            }
            return e.prototype.interpolate = function() {
                var e, t, n, o, i, a, r, s, l, c;
                return function(u) {
                    return a = u ? v.binarySearch(this.x, u) - 1 : 0, e = this.x[a + 1] - this.x[a], r = (u - this.x[a]) / e, s = Math.pow(r, 2), l = Math.pow(r, 3), t = 2 * l - 3 * s + 1, o = l - 2 * s + r, n = -2 * l + 3 * s, i = l - s, c = t * this.y[a] + o * e * this.m[a] + n * this.y[a + 1] + i * e * this.m[a + 1]
                }
            }(), e
        }()
    }).call(this),
        function() {
            "use strict";
            h.prototype.VelocityScroll = function(t) {
                i.defaults(t, {
                    scrollable: this.el
                }), this.scroller && this.scroller.destroy(), this.scroller = new e(t), this._registeredListeners.push("scroller")
            };
            var e = function(e) {
                function t(e) {
                    return e.touches && e.touches.length >= 1 ? e.touches[0].clientX : e.clientX
                }

                function n(e, t) {
                    v = e > g ? g : f > e ? f : e, we.setX(v), !t && c.now() - p < 100 || (ye.updateFromPercentage(v / we.realSongWidth), (t || Math.abs(w) < 300) && be.updateFromPx(v))
                }

                function o() {
                    var e, t, n, o;
                    e = c.now(), t = e - b, b = e, n = v - k, k = v, o = 1e3 * n / (1 + t), w = .8 * o + .2 * w
                }

                function i() {
                    var e, t, o;
                    M && "sheet" === V.lastUpdatedBy && (e = c.now() - b, t = -M * Math.exp(-e / P), o = Math.abs(t), v === f || v === g ? requestAnimationFrame(function() {
                        n(T, !0)
                    }) : o > 4 && (n(T + t, 9 > o || L > o && .9 * !!Math.round((Math.random() + e / y) / 2)), requestAnimationFrame(i)))
                }

                function a(e) {
                    if (!(e.which && 3 === e.which || e.button && 2 === e.button)) {
                        if ("undefined" != typeof window.ontouchstart) {
                            if (e.touches && e.touches.length > 1) return e.stopPropagation(), e.preventDefault(), !1;
                            window.addEventListener("touchend", s), window.addEventListener("touchmove", r)
                        }
                        window.addEventListener("mouseup", s), window.addEventListener("mousemove", r), V.lastUpdatedBy = "sheet", m = t(e), b = p = c.now(), w = M = 0, k = v = we.getX(), clearInterval(S), o(), S = setInterval(o, 25), e.preventDefault()
                    }
                }

                function r(e) {
                    if ("sheet" === V.lastUpdatedBy) {
                        var o, i;
                        o = t(e), i = m - o, (i > 2 || -2 > i) && (m = o, n(v + i)), e.preventDefault()
                    }
                }

                function s(e) {
                    n(v, Math.abs(w) < 50), clearInterval(S), T = v, (w > 10 || -10 > w) && (M = .7 * w, T = v + M), y = Math.log(Math.abs(M)) * P, M = T - v, x && -(3 * L) > M ? x.classList.add("hover") : x.classList.remove("hover"), b = c.now(), requestAnimationFrame(i), l(), v !== k && e.stopPropagation(), e.preventDefault()
                }

                function l() {
                    "undefined" != typeof window.ontouchstart && (window.removeEventListener("touchmove", r), window.removeEventListener("touchend", s)), window.removeEventListener("mousemove", r), window.removeEventListener("mouseup", s)
                }
                var c = window.performance,
                    u, d, p, f, g, v, m, y, w, k, b, S, M, T, P, I, L;
                V.autorun(function() {
                    L = V.width.get()
                }), this.destroy = function() {
                    "undefined" != typeof window.ontouchstart && u.removeEventListener("touchstart", a), u.removeEventListener("mousedown", a), x = u = d = null
                };
                var x = document.getElementById("back-to-start");
                u = document.getElementById(e.container), d = h(document.getElementById(e.movable)), g = e.max, v = f = 0, P = 325, "undefined" != typeof window.ontouchstart && u.addEventListener("touchstart", a), u.addEventListener("mousedown", a)
            }
        }.call(this),
        function() {
            D = {}, F = {}, v.player = V = {
                lastUpdatedBy: "",
                isLoaded: new o(!1),
                width: new o(0),
                _computations: [],
                _events: {
                    load: v.events.create("player.load"),
                    unload: v.events.create("player.unload"),
                    onBeforeStateEvent: v.events.create("player.onBeforeStateEvent"),
                    onAfterStateEvent: v.events.create("player.onAfterStateEvent")
                },
                load: function(e, t) {
                    V.options = t || {}, V.isLoaded.set(!1), D = this.songData = e, this._checkSongData(), this._loadNewSheets(), C = ae.load(), this.syncWindowResize(), this._events.load.data = {
                        song: e,
                        options: t
                    }, v.events.dispatchEvent(this._events.load)
                },
                unload: function() {
                    F = {}, D = this.songData = null, this._clearComputations(), this._unloadStateMachine(), ye.unload(), me.deinit(), ke.unload(), be.unload(), v.events.dispatchEvent(this._events.unload)
                },
                autorun: function(e) {
                    V._computations.push(r.autorun(e))
                },
                hasNewSheet: function(e) {
                    return !!(e.noteEvents_v2 && e.musicsheets_v2 && e.musicsheets_v2.files && e.musicsheets_v2.boxInfo)
                },
                rewriteSyncData: function(e) {
                    var t = n.FlowSheet.currentScale(),
                        o = n.FlowSheet.getSheetWidth();
                    if (o) {
                        var a = e.syncData_v2,
                            r = e.noteEvents_v2[0].notes[0].spatium;
                        return a.x = i.map(a.x, function(e) {
                            var n = e * r * t;
                            return n
                        }), a.x.push(o), a.t.push(1e3 * e.videoDuration), a
                    }
                },
                rewriteNoteEvents: function(e) {
                    var t = n.FlowSheet.currentScale();
                    if (t) {
                        var o = e.noteEvents_v2,
                            a = e.noteEvents_v2[0].notes[0].spatium;
                        i.each(o, function(e) {
                            e.orgX || (e.orgX = e.x), e.x = e.x * a * t
                        })
                    }
                },
                _loadNewSheets: function() {
                    var e = this;
                    return E = this.hasNewSheet(D), !D || i.isEmpty(D) ? (v.log(3, "Fail. You tried to load the player without any song data.."), D = {}) : void(E && this.autorun(function() {
                        function t() {
                            e.rewriteSyncData(D), e.rewriteNoteEvents(D)
                        }
                        return t
                    }()))
                },
                _checkSongData: function() {
                    return !D || i.isEmpty(D) ? (v.log(3, "Fail. You tried to load the player without any song data.."), D = {}) : void 0
                },
                _clearComputations: function() {
                    this._computations && this._computations.forEach(function(e, t, n) {
                        i.isFunction(e.stop) && e.stop(), n.splice(t, 1)
                    })
                },
                _unloadStateMachine: function() {
                    C && (C.transition && C.transition.cancel(), C.unload()), C = null
                },
                syncWindowResize: function() {
                    function e() {
                        var e = document,
                            t = Math.max(e.body.offsetWidth, e.documentElement.offsetWidth, e.body.clientWidth, e.documentElement.clientWidth);
                        return t > 0 ? t : screen.availWidth || screen.width
                    }
                    var t = i.throttle(function() {
                        V.width.set(e())
                    }, 300, {
                        leading: !1
                    });
                    t(), n.FlowPlayer.onDestroyed(function() {
                        $(window).off("resize.player")
                    }), $(window).off("resize.player").on("resize.player", t)
                }
            }
        }.call(this),
        function() {
            function t() {
                var e = "windows" === v.os.curValue,
                    t = "audio" === v.inputManager.inputType.get();
                return t && e
            }
            var n = {
                loopSelection: !0,
                loopActive: !1,
                loopStart: null,
                loopEnd: null,
                speed: 1,
                wait: !1,
                light: !0,
                microphone: !1,
                autoAlign: !1,
                handLimit: [],
                noHand: null,
                hand: "none",
                waitMode: -1,
                lastUsedWaitMode: null,
                isMobile: y.mobile || y.tablet ? !0 : !1
            };
            v.player.settings = z = new u({
                name: "playerSettings",
                rawHelper: "settings",
                init: n
            }), z.onLoad = new l, z.init = function() {
                v.log(1, "[settings] Initialising...");
                var e = a.get("songId");
                z.set(n)
            }, z.load = function() {
                V.autorun(function() {
                    B = z.get("loopSelection"), N = z.get("loopActive"), W = z.get("hand"), O = z.get("wait"), U = z.get("speed"), R = z.get("light"), Y = z.get("muted"), K = z.get("loopStart"), X = z.get("loopFirstEvent"), q = z.get("loopStartTime"), j = z.get("loopEnd"), G = z.get("loopEndTime"), Q = z.get("loopLastEvent"), Z = z.get("waitMode"), J = z.get("lastUsedWaitMode"), ee = z.get("microphone"), te = z.get("noHand"), ne = z.get("micType"), oe = z.get("isMobile")
                }), z.onLoad.run()
            }, z.onChange("light", function(e, t) {
                var n = t;
                n ? $("#piano").removeClass("hide") : $("#piano").addClass("hide")
            }), z.afterSet("isMobile", function(e, t) {
                t === !0 && z.set("splineType", "linear")
            }), z.beforeSet("speed", function(e, t) {
                var n = .2 > t ? .2 : t > 1 ? 1 : t;
                this.change(n)
            }), z.beforeSet("hand", function(e, t) {
                "error" === t && this.cancel()
            }), z.afterSet("hand", function(e, t) {
                de.setHand(t), ve.update(de.n), he.updateHandEvents();
                var n = z.get("waitMode");
                if ("none" === e && "none" !== t) {
                    if (-1 === n) {
                        var o = z.get("lastUsedWaitMode"),
                            i = o > 0 ? o : 2;
                        z.set("waitMode", i)
                    }
                } else "none" === t && z.set("waitMode", -1)
            }), z.afterSet("microphone", function(e, n) {
                n === !0 && he.loadSource(), n === !1 && t() && v.audioManager.unloadSource()
            }), z.onChange("wait", function(e, t) {
                var n = t;
                n === !0 && (z.set("muted", !0), z.set("light", !0))
            }), z.afterSet("wait", function(e, t) {
                var n = t;
                n === !1 && C.is("waiting") && C.pause()
            }), z.beforeSet("waitMode", function(t, n) {
                function o() {
                    z.set("microphone", !0), e.defer(function() {
                        r.autorun(function(e) {
                            var t = v.inputManager.getCurrentInputStatus();
                            "ready" === t ? (e.stop(), z.set("waitMode", 2)) : "loading" !== t && "unloaded" !== t && (e.stop(), z.set("waitMode", 3)), "noSource" === t && (e.stop(), z.set("waitMode", 2))
                        })
                    })
                }
                var i = z.get("microphone"),
                    a = v.inputManager.getCurrentInputStatus();
                if (2 === n) {
                    var s = "disabled" === a || "noSource" === a || "rejected" === a;
                    s && this.change(3), i || "unloaded" !== a || (this.cancel(), o())
                }
            }), z.afterSet("waitMode", function(e, t) {
                var n = t,
                    o = 1,
                    i = z.get("hand"); - 1 == n && (z.set("wait", !1), z.set("muted", !1), z.set("microphone", !1), "none" !== i && z.set("hand", "none")), 2 === n && (o = 1, z.set("wait", !0), z.set("muted", !0), z.set("microphone", !0)), 3 === n && (o = .5, z.set("muted", !1), z.set("wait", !1), z.set("microphone", !1)), 4 === n && (o = .7, z.set("muted", !1), z.set("wait", !1), z.set("microphone", !1)), n > 0 && z.set("lastUsedWaitMode", n), z.set("speed", o)
            }), z.afterSet("loopSelection", function(e) {
                !e && v.player.loop.isOpen && me.close()
            }), z.beforeSet("loopStart", function(e, t) {
                var n = 0 > t ? 0 : t;
                this.change(n)
            }), z.afterSet("loopStart", function(e, t) {
                K = t, z.set("loopFirstEvent", de.afterPx(K)), z.set("loopStartTime", ke.pixelToTime.interpolate(K))
            }), z.beforeSet("loopEnd", function(e, t) {
                var n = t < we.realSongWidth ? t : we.realSongWidth;
                this.change(n)
            }), z.afterSet("loopEnd", function(e, t) {
                var n = t;
                z.set("loopLastEvent", de.afterPx(n) - 1), z.set("loopEndTime", ke.pixelToTime.interpolate(n))
            }), ie = function() {
                function e() {
                    var e = v.findIn(Songs.findOne(), "_id"),
                        t = a.get("playerState." + e),
                        n = ["waitMode", "hand", "speed"];
                    t && (controls.movePlayerToPx(t.sheetPosition, !0), t.settings = i.pick(t.settings, n), z.set(t.settings))
                }
                return e
            }()
        }.call(this),
        function() {
            var e = function() {
                function e() {
                    k.classCallCheck(this, e), this.override = null, this._setupMicCatcher(), this._setupSettingBlocker()
                }
                return e.prototype.set = function() {
                    function e(e) {
                        this.override = e;
                        for (var t = Object.entries(e), n = Array.isArray(t), o = 0, t = n ? t : t[b.iterator]();;) {
                            var i;
                            if (n) {
                                if (o >= t.length) break;
                                i = t[o++]
                            } else {
                                if (o = t.next(), o.done) break;
                                i = o.value
                            }
                            var a = i[0],
                                r = i[1];
                            z.set(a, r)
                        }
                        me.repositionMarker()
                    }
                    return e
                }(), e.prototype.clear = function() {
                    function e() {
                        this.override = null
                    }
                    return e
                }(), e.prototype._setupMicCatcher = function() {
                    function e() {
                        var e = v.findIn(this.override, "settings.microphone");
                        V.autorun(function() {
                            if (e) {
                                var t = v.inputManager.getCurrentInputStatus();
                                ("rejected" === t || "noSource" === t) && console.warn("Mic is not working, you need the microphone to play this song")
                            }
                        })
                    }
                    return e
                }(), e.prototype._setupSettingBlocker = function() {
                    function e() {
                        var e = this;
                        z.beforeSet(function(t, n) {
                            var o = this;
                            e.override && Object.keys(e.override).includes(o.name) && n !== e.override[o.name] && o.cancel()
                        })
                    }
                    return e
                }(), e
            }();
            v.player.settings.override = new e
        }.call(this),
        function() {
            ae = ae || {}, ae.load = function() {
                return C || V.isLoaded.get() !== !1 ? V.isLoaded.set(!0) : (v.log(1, "[pSm] Loading Player State Machine..."), v.player.pSm = C = c.create({
                    initial: "unloaded",
                    events: ae.events,
                    callbacks: ae.stateTransitions
                }), C.load()), C
            }, ae.events = [{
                name: "load",
                from: "unloaded",
                to: "paused"
            }, {
                name: "play",
                from: ["paused", "waiting", "looping", "readyToLoop"],
                to: "playing"
            }, {
                name: "pause",
                from: ["playing", "waiting", "looping"],
                to: "paused"
            }, {
                name: "wait",
                from: ["playing", "paused", "looping", "readyToLoop"],
                to: "waiting"
            }, {
                name: "loop",
                from: ["playing", "readyToLoop"],
                to: "looping"
            }, {
                name: "unload",
                from: "*",
                to: "unloaded"
            }, {
                name: "openLoop",
                from: "paused",
                to: "readyToLoop"
            }, {
                name: "quitLoop",
                from: "readyToLoop",
                to: "paused"
            }]
        }.call(this),
        function() {
            ae = ae || {}, ae.stateTransitions = {
                onbeforeplay: function(e, t, n) {
                    return be.setVolume(1), 2 === z.get("waitMode") && "ready" !== v.inputManager.getCurrentInputStatus() ? (v.inputManager.currentInputManager.curValue.loadSource(), !1) : void 0
                },
                onplay: function(e, t, n) {
                    return "readyToLoop" === t || "paused" === t && !z.get("loopSelection") ? C.loop() : void be.play(t)
                },
                onleaveplaying: function(e, t, n) {
                    "loop" !== e && be.setVolume(0, 50, be.pause)
                },
                onpause: function(e, t, n) {
                    N && C.openLoop(), O && he.stop()
                },
                onleavepaused: function(e, t, n) {
                    if ("openLoop" === e) {
                        if (!B) return;
                        return N ? me.create(C.transition, {
                            loopStart: K,
                            loopEnd: j
                        }) : me.create(C.transition), c.ASYNC
                    }
                },
                onloop: function() {
                    var e, t, n, o, i, a, r;
                    return function() {
                        V.lastUpdatedBy = "loop", e = we.getX(), re = z.get("loopStart"), n = z.get("loopEnd"), se = z.get("loopStartTime"), i = z.get("loopEndTime"), a = (i - se) / 3, r = O ? 0 : .2 * a, a *= Math.min(1, Math.abs(e - re) / (n - re)), a = Math.min(1300, a), ve.piano.clearFromArray(), we.transitionToPx(re, a, function() {
                            function e() {
                                setTimeout(function() {
                                    R && v.player.lightningKeys.update()
                                }, 50), setTimeout(function() {
                                    O && he.resyncEvent(), C.is("paused") || C.is("readyToLoop") ? console.log("[pSm] pSm paused, don't restart loop") : C.play()
                                }, 100)
                            }
                            return e
                        }())
                    }
                }(),
                onleavereadyToLoop: function(e, t, n) {
                    var o = z.get("loopSelection");
                    return "quitLoop" === e && o ? (me.close(C.transition), c.ASYNC) : void(("playing" === n || "waiting" === n) && (o && (me.update(), me.destroySelector()), C.transition.cancel()))
                },
                onbeforewait: function(e, t, n) {
                    he.resyncEvent(), be.pause()
                },
                onleaveunloaded: function() {
                    return z.load(), de.init(), be.load(), we.load(), ke.load(), r.autorun(function(e) {
                        be.isLoaded.get() && we.isLoaded.get() && ke.isLoaded.get() && (e.stop(), V.isLoaded.set(!0), C.is("unloaded") && C.transition())
                    }), ve.init(), he.init(), V.settings.init(), me.init(), c.ASYNC
                },
                onafterload: function() {
                    ge.load(), F && F.settings && z.set(F.settings), v.log(1, "[player] Finished loading successfully!")
                },
                onunload: function() {
                    v.log(1, "[player] Unloading..."), C.is("playing") && C.pause(), C.is("readyToLoop") && C.quitLoop(), z.set("microphone", !1), ge.unload(), ke.isLoaded.set(!1), be.isLoaded.set(!1), we.isLoaded.set(!1), V.isLoaded.set(!1), e.isCordova && v.audioManager.unloadSource(), v.log(1, "[player] Finished unloading successfully...")
                },
                onbeforeevent: function(e, t, n) {
                    V._events.onBeforeStateEvent.data = {
                        event: e,
                        from: t,
                        to: n
                    };
                    try {
                        v.events.dispatchEvent(V._events.onBeforeStateEvent)
                    } catch (o) {
                        console.warn(o)
                    }
                },
                onafterevent: function(e, t, n) {
                    V._events.onAfterStateEvent.data = {
                        event: e,
                        from: t,
                        to: n
                    };
                    try {
                        v.events.dispatchEvent(V._events.onAfterStateEvent)
                    } catch (o) {
                        console.warn(o)
                    }
                }
            }
        }.call(this),
        function() {
            n.__checkName("piano"), n.piano = new n("Template.piano", function() {
                var e = this;
                return A.DIV({
                    id: "piano",
                    "class": function() {
                        return ["accelerate3d bottomAboveSheet ", x.mustache(e.lookup("playerSettings"), "isMobile")]
                    },
                    style: function() {
                        return x.mustache(e.lookup("style"))
                    }
                }, A.Raw('\n    \n        <div class="white key a first number-9"></div>\n        <div class="black key a-sharp number-10"></div>\n        <div class="white key b number-11"></div>\n    \n    \n        <div class="white key c number-0"></div>\n        <div class="black key c-sharp number-1"></div>\n        <div class="white key d number-2"></div>\n        <div class="black key d-sharp number-3"></div>\n        <div class="white key e number-4"></div>\n        <div class="white key f number-5"></div>\n        <div class="black key f-sharp number-6"></div>\n        <div class="white key g number-7"></div>\n        <div class="black key g-sharp number-8"></div>\n        <div class="white key a number-9"></div>\n        <div class="black key a-sharp number-10"></div>\n        <div class="white key b number-11"></div>\n    \n    \n        <div class="white key c number-0"></div>\n        <div class="black key c-sharp number-1"></div>\n        <div class="white key d number-2"></div>\n        <div class="black key d-sharp number-3"></div>\n        <div class="white key e number-4"></div>\n        <div class="white key f number-5"></div>\n        <div class="black key f-sharp number-6"></div>\n        <div class="white key g number-7"></div>\n        <div class="black key g-sharp number-8"></div>\n        <div class="white key a number-9"></div>\n        <div class="black key a-sharp number-10"></div>\n        <div class="white key b number-11"></div>\n    \n    \n        <div class="white key c number-0"></div>\n        <div class="black key c-sharp number-1"></div>\n        <div class="white key d number-2"></div>\n        <div class="black key d-sharp number-3"></div>\n        <div class="white key e number-4"></div>\n        <div class="white key f number-5"></div>\n        <div class="black key f-sharp number-6"></div>\n        <div class="white key g number-7"></div>\n        <div class="black key g-sharp number-8"></div>\n        <div class="white key a number-9"></div>\n        <div class="black key a-sharp number-10"></div>\n        <div class="white key b number-11"></div>\n    \n    \n        <div class="white key c number-0"></div>\n        <div class="black key c-sharp number-1"></div>\n        <div class="white key d number-2"></div>\n        <div class="black key d-sharp number-3"></div>\n        <div class="white key e number-4"></div>\n        <div class="white key f number-5"></div>\n        <div class="black key f-sharp number-6"></div>\n        <div class="white key g number-7"></div>\n        <div class="black key g-sharp number-8"></div>\n        <div class="white key a number-9"></div>\n        <div class="black key a-sharp number-10"></div>\n        <div class="white key b number-11"></div>\n    \n    \n        <div class="white key c number-0"></div>\n        <div class="black key c-sharp number-1"></div>\n        <div class="white key d number-2"></div>\n        <div class="black key d-sharp number-3"></div>\n        <div class="white key e number-4"></div>\n        <div class="white key f number-5"></div>\n        <div class="black key f-sharp number-6"></div>\n        <div class="white key g number-7"></div>\n        <div class="black key g-sharp number-8"></div>\n        <div class="white key a number-9"></div>\n        <div class="black key a-sharp number-10"></div>\n        <div class="white key b number-11"></div>\n     \n    \n        <div class="white key c number-0"></div>\n        <div class="black key c-sharp number-1"></div>\n        <div class="white key d number-2"></div>\n        <div class="black key d-sharp number-3"></div>\n        <div class="white key e number-4"></div>\n        <div class="white key f number-5"></div>\n        <div class="black key f-sharp number-6"></div>\n        <div class="white key g number-7"></div>\n        <div class="black key g-sharp number-8"></div>\n        <div class="white key a number-9"></div>\n        <div class="black key a-sharp number-10"></div>\n        <div class="white key b number-11"></div>\n    \n    \n        <div class="white key c number-0"></div>\n        <div class="black key c-sharp number-1"></div>\n        <div class="white key d number-2"></div>\n        <div class="black key d-sharp number-3"></div>\n        <div class="white key e number-4"></div>\n        <div class="white key f number-5"></div>\n        <div class="black key f-sharp number-6"></div>\n        <div class="white key g number-7"></div>\n        <div class="black key g-sharp number-8"></div>\n        <div class="white key a number-9"></div>\n        <div class="black key a-sharp number-10"></div>\n        <div class="white key b number-11"></div>\n    \n    \n        <div class="white key c number-0"></div>\n    \n'))
            })
        }.call(this),
        function() {
            function e(e, t) {
                if (e) {
                    var n = t || 0,
                        o = e[n],
                        a;
                    return i.isArray(o) ? (a = o, o = o[0]) : a = e, o.nodeType ? a : !1
                }
            }
            var t = new RegExp("\\s*light\\s*"),
                o = /pulse-(\w*)?/g,
                a = /pulse-(\w*)?|light/g;
            le = function(e) {
                this.piano = e.piano, this.litKeys = [], this.allKeys = e.allKeys, this.allCss3dKeys = [], this.topOffset = e.topOffset, this.keyPositions = ue, this.positionPiano(ue, ce)
            }, i.extend(le.prototype, {
                drawNoteNamesWhenActive: function() {
                    this.removeNoteNames();
                    var e = !!v.profile.get("noteNamesVisible");
                    e && this.drawNoteNames()
                },
                drawNoteNames: function() {
                    var e = this.createKeyNameMap();
                    this.allKeys.forEach(function(t, n, o) {
                        var i = e.has(n) && e.get(n);
                        i ? $('<div class="lk-noteName lk-noteName-' + i.length + '">' + i + "</div>").appendTo(t) : v.log(3, "[Piano] Song does not have any data for Note Names")
                    })
                },
                removeNoteNames: function() {
                    $("#piano .lk-noteName").remove()
                },
                createKeyNameMap: function() {
                    var e = this,
                        t = E ? D.noteEvents_v2 : D.noteEvents;
                    return this.keyNameMap ? this.keyNameMap : (this.keyNameMap = new S, i.map(t, function(t) {
                        for (var n = t.notes, o = Array.isArray(n), i = 0, n = o ? n : n[b.iterator]();;) {
                            var a;
                            if (o) {
                                if (i >= n.length) break;
                                a = n[i++]
                            } else {
                                if (i = n.next(), i.done) break;
                                a = i.value
                            }
                            var r = a;
                            r.noteName && (r.noteName = r.noteName.replace(/b/g, "♭"), r.noteName = r.noteName.replace(/#/g, "♯"), "de" === v.findIn(v, "lang.currentLanguage.curValue") && (r.noteName = r.noteName.replace(/B/g, "H"), r.noteName = r.noteName.replace("H♭", "B"))), e.keyNameMap.set(r.key - 21, r.noteName)
                        }
                    }), this.keyNameMap)
                },
                cleanupPiano: function() {
                    var e = this.createKeyNameMap();
                    this.allKeys.forEach(function(t, n, o) {
                        e.has(n) ? $('<div class="lk-background"></div>').appendTo(t) : ($(t).remove(), o[n] = null)
                    }), this.allCss3dKeys = this.allKeys.slice(), this.allCss3dKeys.forEach(function(e, t, n) {
                        e && (n[t] = h(e), n[t].style[h.transform] = "translate3d(0,-1024px,0)")
                    })
                },
                drawFromArray: function(e) {
                    for (var t = e.length; t--;) this.allCss3dKeys[e[t]] && (this.allCss3dKeys[e[t]].style[h.transform] = "translate3d(0,0,0)");
                    this.litKeys = e
                },
                clearFromArray: function() {
                    for (var e = this.litKeys.length, t = this.allKeys; e--;) this.allCss3dKeys[this.litKeys[e]] && (this.allCss3dKeys[this.litKeys[e]].style[h.transform] = "translate3d(0,-1024px,0)");
                    this.litKeys.length = 0
                },
                positionPiano: function(e, t) {
                    var n = 1092 / 370,
                        o = t,
                        i = o * n;
                    return $(".key").css("top", i + "%"), this.setPiano(e)
                },
                setPiano: function(e) {
                    $(".key").each(function(t, n) {
                        e[t + 1] && (n.style.left = e[t] + "%", n.style.width = e[t + 1] - e[t] + "%")
                    })
                }
            }), n.piano.load = function(e) {
                return ce = e.lkYoffset, ue = e.lkKeys, new le({
                    allKeys: $("#piano .key").get(),
                    piano: $("#piano").get(0),
                    keyPositions: ue,
                    topOffset: ce
                })
            }, n.piano.helpers({
                style: function() {
                    return this.width && this.height ? "width: " + this.width + "px; height: " + this.height + "px" : void 0
                }
            }), n.piano.onCreated(function() {
                var e = this;
                n.piano.toggleNoteNames = function() {
                    return v.profile.set("noteNamesVisible", !v.profile.get("noteNamesVisible"))
                }
            }), n.piano.onRendered(function() {
                this.autorun(function(e) {
                    v.player.lightningKeys.inited.get() && v.player.lightningKeys.piano.drawNoteNamesWhenActive()
                })
            }), n.piano.onDestroyed(function() {
                v.player.lightningKeys.deinit()
            })
        }.call(this),
        function() {
            function e(e) {
                var t = V.hasNewSheet(D);
                u.both = t ? D.noteEvents_v2 : e || D.noteEvents, u.left = t ? h("left") : p("left"), u.right = t ? h("right") : p("right");
                var n = t ? D.syncData_v2 : D.syncData;
                pe = i.drop(n.x), pe = i(pe).map(g), d = u.both.length - 1, c("both"), f("left") && z.set("noHand", "left"), f("right") && z.set("noHand", "right"), de.n = -1
            }

            function t(e) {
                return de.list[e] && !!de.list[e].notes.length
            }

            function n(e) {
                return v.binarySearch(pe, g(e))
            }

            function o(e, t) {
                return e = Math.max(0, Math.min(d, e || de.n)), t ? de.list[e] : e
            }

            function a(e, t) {
                return t ? de.list[n(e) - 1] : n(e) - 1
            }

            function r() {
                return u
            }

            function s(e, t, n) {
                var i = o(de.n + (e || 0));
                return n && !de.list[i].notes.length && (e = e >= 0 ? e + 1 : e - 1, de.list[i + e]) ? s.call(this, e, t, n) : t ? de.list[i] : i
            }

            function l(e) {
                void 0 === e && (e = a(we.getX())), R && ve.update(e), de.n = e
            }

            function c(e) {
                "none" === e && (e = "both"), de.list = u[e]
            }
            v.player.event = de = {
                n: -1,
                init: e,
                setHand: c,
                afterPx: n,
                atPx: a,
                update: l,
                getCurrent: s,
                getSongEvents: r,
                getExistingEvent: o,
                hasNotes: t
            };
            var u = {
                    both: [],
                    left: [],
                    right: []
                },
                d, p = function(e) {
                    var t = u.both,
                        n = i.map(t, i.clone);
                    return i(t).each(function(t, o) {
                        var a = "right" === e ? t.hands.l : t.hands.r;
                        n[o].notes = i(t.notes).reject(function(e) {
                            return i.contains(a, e.key)
                        })
                    }), n
                },
                h = function(e) {
                    var t = u.both,
                        n = i.map(t, i.clone);
                    return i(t).each(function(t, o) {
                        n[o].notes = i(t.notes).filter(function(t) {
                            return t.hand === e
                        })
                    }), n
                },
                f = function(e) {
                    "none" === e && (e = "both");
                    var t = i.some(u[e], function(e) {
                        return e.notes.length > 0
                    });
                    return !t
                },
                g = function(e) {
                    return Math.round(e)
                }
        }.call(this),
        function() {
            e.startup(function() {
                function e(e, o) {
                    e > s && "waiting" === v.player.pSm.current && (n(), t(o)), s = e
                }

                function t(e) {
                    try {
                        v.events.trigger("followCorrect", e)
                    } catch (t) {
                        v.log(3, t)
                    }
                }

                function n() {
                    fe.set(!0), setTimeout(function() {
                        fe.set(!1)
                    }, 500)
                }
                window.followerController || (window.followerController = he = new m), v.events.listen("follow", function(t) {
                    var n = t.data.nextEventNumber;
                    e(n, r), C.is("waiting") && C.play()
                });
                var a, r;
                v.events.listen("nextExpected", function(e) {
                    r = a, a = e.data.event.id
                });
                var s;
                fe = new o(!1);
                var l = {
                    startFollowing: function() {
                        v.log(1, "[follower] Activating");
                        try {
                            he.resyncEvent(), he.start()
                        } catch (e) {
                            v.log(3, e)
                        }
                    },
                    checkWait: function() {
                        var e = V.event.n;
                        if (N)
                            if (X > e) this.setCurrentEvent(X);
                            else if (e > Q) return;
                        return de.hasNotes(e) ? e >= this.helper.getCurrentEvent() ? (C.can("wait") && C.wait(), !0) : !1 : (v.log(1, "no notes for event", e, "-- skipping"), !1)
                    },
                    resyncEvent: function() {
                        he.setCurrentEvent(V.event.getCurrent())
                    },
                    updateHandEvents: function() {
                        this.setEvents(V.event.list)
                    }
                };
                i.extend(m.prototype, l)
            })
        }.call(this),
        function() {
            ge = new p({
                autoLoad: !1
            }), ge.add({
                combo: "p",
                callback: function() {
                    e.isCordova || v.player.video.preloadVideo()
                }
            }), ge.add({
                combo: "space",
                callback: function() {
                    C.can("pause") ? C.pause() : C.can("play") && C.play()
                }
            });
            var t = function(e) {
                if ("paused" === C.current || "readyToLoop" === C.current) {
                    "hotkeys" !== V.lastUpdatedBy && de.update();
                    var t = de.getCurrent(e, !0, !0),
                        n = t ? t.x : 0;
                    ve.piano.clearFromArray(), V.lastUpdatedBy = "hotkeys", we.transitionToPx(n, 500, function() {
                        de.update(t.id)
                    }), de.n = t.id
                }
            };
            ge.add({
                combo: "left",
                callback: i.partial(t, -1)
            }), ge.add({
                combo: "shift+left",
                callback: i.partial(t, -5)
            }), ge.add({
                combo: "right",
                callback: i.partial(t, 1)
            }), ge.add({
                combo: "shift+right",
                callback: i.partial(t, 5)
            }), ge.add({
                combo: ["shift+l", "ctrl+l"],
                callback: function() {
                    return C.is("readyToLoop") ? (console.log("close Loop"), C.quitLoop()) : C.openLoop(), !1
                }
            })
        }.call(this),
        function() {
            function e() {
                a = [], ve.piano = n.piano.load(D), ve.piano.cleanupPiano(), ve.inited.set(!0)
            }

            function t() {
                ve.inited.set(!1), ve.piano = null
            }

            function i(e) {
                ve.piano.clearFromArray();
                for (var t = de.getExistingEvent(e, !0), n = t.notes.length - 1; n >= 0; n--) a.push(t.notes[n].key - 21);
                ve.piano.drawFromArray(a)
            }
            v.player.lightningKeys = ve = {
                init: e,
                update: i,
                deinit: t,
                inited: new o(!1)
            };
            var a = []
        }.call(this),
        function() {
            function e(e) {
                e.stopPropagation(), e.preventDefault()
            }

            function t() {
                c = h("#selectorElement"), u = h("#loop_marker"), d = $("#sheet"), c.el.addEventListener("mousedown", e, !1)
            }

            function n() {
                c && (c.el.removeEventListener("mousedown", e, !1), c.destroy()), u && u.destroy(), d = null
            }

            function o() {
                var e = z.get("loopStart"),
                    t = z.get("loopEnd");
                "undefined" != typeof e && "undefined" != typeof t && (z.set("loopActive", !0), u.setTranslate(e), u.style.width = t - e + "px", u.style.display = null)
            }

            function i(e, t) {
                z.set("loopActive", !0), v.log(1, "[loop] Creating loop..."), this.isOpen = !0, t ? (c.setTranslate(t.loopStart), c.$el.stop(!0, !0).show().appendTo(d), c.style.width = t.loopEnd - t.loopStart + "px", e && e()) : (c.$el.stop(!0, !0).show().addClass("animating"), c.setTranslate(0), c.setScale(1, 1, 1), c.style.width = "300px", setTimeout(function() {
                    c.setTranslate(we.getX()), c.$el.appendTo(d).removeClass("animating").addClass("noTransition"), c.SimpleResize({
                        max: we.realSongWidth
                    }), c.SimpleDrag({
                        max: we.realSongWidth,
                        onEnd: function() {
                            !this.dragging && C.is("readyToLoop") && C.quitLoop()
                        }
                    }), e && e()
                }, 300))
            }

            function a(e) {
                v.log(1, "[loop] Updating the loop");
                var t = c.getX(),
                    n = t + parseInt(c.style.width);
                z.set({
                    loopStart: t,
                    loopEnd: n
                }), o()
            }

            function s() {
                v.log(1, "[loop] Destroying the loop"), this.isOpen = !1, c.$el.fadeOut(800)
            }

            function l(e) {
                v.log(1, "[loop] Closing the loop"), this.isOpen = !1, u.$el.hide(), c.$el.fadeOut(400, function() {
                    z.set({
                        loopActive: !1,
                        loopStart: null,
                        loopEnd: null
                    }), r.flush(), c.$el.removeClass("noTransition").appendTo(d.parent()).show(), c.style.cssText = null, c.dragger && c.dragger.destroy(), c.resizer && c.resizer.destroy(), e && e()
                })
            }
            v.player.loop = me = {
                init: t,
                deinit: n,
                close: l,
                create: i,
                update: a,
                repositionMarker: o,
                destroySelector: s,
                isOpen: !1
            };
            var c, u, d
        }.call(this),
        function() {
            function e() {
                $("#flat-timebar").on("touchstart", d).on("mousedown", d), i = h(".timeCircle"), a = h(".progressBar"), V.autorun(function(e) {
                    r = V.width.get() - i.$el.width(), u.max = r, i.SimpleDrag(u), e.firstRun || o(we.getX() / we.realSongWidth, !0)
                })
            }

            function t() {
                $("#flat-timebar").off("touchstart").off("mousedown"), i && i.destroy(), a && a.destroy()
            }

            function n() {
                return a.getScaleX()
            }

            function o(e, t) {
                ("progressBar" !== V.lastUpdatedBy || t) && (c(e), l(e))
            }
            ye = {
                load: e,
                getPercentage: n,
                updateFromPercentage: o,
                unload: t
            };
            var i, a, r = 0,
                s, l = function(e) {
                    a.setScale(e)
                },
                c = function(e) {
                    i.setTranslate(e * r)
                },
                u = {
                    onStart: function() {
                        V.lastUpdatedBy = "progressBar"
                    },
                    onUpdate: function(e, t) {
                        "progressBar" === V.lastUpdatedBy && (s = e / t, we.setToPercentage(s), l(s), be.updateFromPx(s * we.realSongWidth))
                    }
                },
                d = function(e) {
                    if (V.lastUpdatedBy = "progressBar", !e.target || "flat-timeCircle" !== e.target.id) {
                        var t = e.pageX || e.screenX,
                            n = 20,
                            o = a.$el.width();
                        t = n > t ? 0 : t > o + n ? o : t - n, c(t / o), u.onUpdate(t, o);
                        var e = new MouseEvent("mousedown", {
                            bubbles: !0,
                            cancelable: !0
                        });
                        e.synthetic = !0, i.el.dispatchEvent(e, !0)
                    }
                }
        }.call(this),
        function() {
            function t() {
                v.log(1, "[sheet] Initialising..."), we.isLoaded.set(!1), ye ? ye.load() : console.warn("Warning: progressBar not found!"), d = h("#sheet"), we.transitionToPx = f, we.realSongWidth = p = E ? n.FlowSheet.getSheetWidth() : i.last(D.syncData.x), V.autorun(function() {
                    function e() {
                        we.accidentalPos = v.window.width.get() / 2 + 30
                    }
                    return e
                }()), we.showAccidental = new o(!1), d.VelocityScroll({
                    container: "sheet",
                    movable: "sheet",
                    max: p
                }), v.log(1, "[sheet] Loading...");
                var t = [];
                $("#sheet img").each(function(e, n) {
                    var o = new T(function(e, t) {
                        return n.complete ? e() : (n.onload = function() {
                            e(), n.onload = null
                        }, void(n.onerror = function() {
                            t(), n.onerror = null
                        }))
                    });
                    t.push(o)
                }), T.all(t).then(function() {
                    we.setX(0), we.isLoaded.set(!0)
                }, function() {
                    throw new e.Error(600, "Error 600: Player Sheet image failed to load")
                })
            }

            function a() {
                return -d.getX()
            }

            function r(e) {
                d.style[h.transform] = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0," + -e + ", 0, 0, 1)", e > we.accidentalPos ? we.showAccidental.curValue === !1 && we.showAccidental.set(!0) : we.showAccidental.curValue === !0 && we.showAccidental.set(!1)
            }

            function s(e) {
                r(e * p)
            }

            function l(e, t, n) {
                f(de.list[e].x, t, n)
            }

            function c(e, t, n) {
                f(e * p, t, n)
            }

            function u(e, t, n) {
                f(ke.timeToPixel.interpolate(e), t, n)
            }
            var d, p;
            v.player.sheet = we = {
                isLoaded: new o(!1),
                load: t,
                getX: a,
                setX: r,
                setToPercentage: s,
                transitionToPx: f,
                transitionToTime: u,
                transitionToEvent: l,
                transitionToPercentage: c
            };
            var f = function() {
                var e, t, n = window.performance,
                    o, i, a, s, l, c, u, h, f, g = function() {
                        e = n.now() - i, u = s && s > e ? o + c * e : a, r(u), be.isPlaying || N || be.updateFromPx(u), ye.updateFromPercentage(u / p), s > e && u !== a ? t = window.requestAnimationFrame(g) : (t = null, be.updateFromPx(u), f && f())
                    };
                return function(e, r, u) {
                    o = -d.getX(), i = n.now(), f = u, s = r || 0, a = e, l = a - o, c = l / s, t || g()
                }
            }()
        }.call(this),
        function() {
            function e() {
                var e = this;
                ke.isLoaded.set(!1), v.log(1, "[sync] Loading..."), V.autorun(function() {
                    var t = z.get("splineType"),
                        n = e.syncData = E ? D.syncData_v2 : D.syncData;
                    "linear" === t ? (ke.timeToPixel = new H(n.t, n.x), ke.pixelToTime = new H(n.x, n.t)) : (ke.timeToPixel = new _(n.t, n.x), ke.pixelToTime = new _(n.x, n.t))
                }), l = i.drop(e.syncData.t), s = i.drop(e.syncData.x);
                var t = i.size(l) - 1;
                w = l[t], ke.isLoaded.set(!0), v.log(1, "[sync] Loading complete...")
            }

            function t() {
                s = l = null, d && window.cancelAnimationFrame(d)
            }

            function n() {
                V.lastUpdatedBy = "sync", u = r();
                var e = we.getX();
                if (m = be.updateFromPx(e), de.n = de.atPx(e), v.log(1, "[sync] Starting at event", de.n, e), O && e - (s[de.n] || 0) > 10) {
                    var t = de.getCurrent(1, !1, !0);

                    he.setCurrentEvent(t)
                }
                a(), h = z.get("speed"), g = c.now() * h - m, window.requestAnimationFrame(k)
            }

            function a() {
                ve.update(de.n), y = s[de.n + 1], O && he.checkWait() && (p = s[de.n], we.setX(p), be.updateFromPx(p))
            }

            function r() {
                function e() {
                    a = be.getCurrentTime(), i = m - a, Math.abs(i) > 30 ? (v.log(1, "[sync] Correcting sync by", i), t = 1, n = 60, r = i / (.75 * n)) : o >= n && (n += 60)
                }
                var t = 0,
                    n = 60,
                    o = 600,
                    i = 0,
                    a = 0,
                    r = 0;
                return function() {
                    O || (r ? (g += r, ++t >= .75 * n && (r = 0, a === be.getCurrentTime() && (v.log(2, "[sync] Video is actually paused"), be.isPlaying = !1))) : d % n === 0 && setTimeout(e, 0))
                }
            }
            v.player.sync = ke = {
                isLoaded: new o(!1),
                load: e,
                unload: t,
                start: n
            };
            var s, l, c = window.performance,
                u, d, p, h, f, g, m, y, w, k = function() {
                    return "paused" === C.current || "sync" !== V.lastUpdatedBy || m >= w ? b() : (f = c.now(), be.isPlaying !== !0 ? (g = f * h - m, d = window.requestAnimationFrame(k)) : (u(), m = f * h - g, p = ke.timeToPixel.interpolate(m), ye.updateFromPercentage(p / we.realSongWidth), we.setX(p), N && m >= G ? (be.pause(), void C.loop()) : (p >= y && (de.n++, a()), void(d = window.requestAnimationFrame(k)))))
                },
                b = function() {
                    d = null, C.is("looping") || C.can("pause") && (C.pause(), m >= w && be.ended())
                }
        }.call(this),
        function() {
            function e(e) {
                function t() {
                    v.log("play() called but pSm isn't playing. Instead it is", C.current), y.pause(), C.play()
                }
                C.is("playing") ? (Se.one("play", function() {
                    be.isPlaying = !0, M(), ke.start(), O && "waiting" !== e && he.startFollowing()
                }), y.play()) : t()
            }

            function t() {
                clearTimeout(m), y.pause();
                var e = we.getX();
                be.updateFromPx(e), be.isPlaying = !1
            }

            function n() {
                N || (C.can("pause") && C.pause(), be.isPlaying = !1, we.setX(0), be.updateFromTime(0))
            }

            function a() {
                return Math.round(1e3 * y.currentTime)
            }

            function r(e) {
                return isNaN(e) ? e : (y.readyState >= 3 && 0 !== y.networkState ? y.currentTime = e / 1e3 : y.readyState > 0 && k(e), e)
            }

            function s(e) {
                return e = Math.abs(e || 0), r(ke.pixelToTime.interpolate(e))
            }

            function l(e) {
                return e = 0 > e ? 0 : e > 1 ? 1 : e, r(y.duration * e * 999)
            }

            function c(e, t, n) {
                Y && (e = 0), e && t ? $(y).stop(!0, !0).animate({
                    volume: e
                }, t, n) : (y.volume = e, n && n())
            }

            function u() {
                S(), d(v.loadCf(D.videoMp4), function() {
                    v.notification.alert({
                        title: "Video Preload",
                        message: "The video has been completly preloaded."
                    }), M()
                })
            }

            function d(e, t) {
                var n = new XMLHttpRequest;
                n.open("GET", e, !0), n.responseType = "arraybuffer", n.onload = function(e) {
                    var n = new Blob([e.target.response], {
                        type: "video/mp4"
                    });
                    y.src = URL.createObjectURL(n), t && t()
                }, n.onprogress = function(e) {
                    if (e.lengthComputable) {
                        var t = e.loaded / e.total;
                        console.log("Preload Video Progress", t)
                    }
                }, n.send()
            }

            function p(e) {
                function t() {
                    0 !== y.readyState && (v.log(1, "[video] Loading..."), clearTimeout(o)), Se.off("loadStart")
                }

                function n() {
                    Se.off("canplaythrough"), w(), be.isLoaded.set(!0)
                }
                if (v.log(1, "[video] Initialising..."), be.isLoaded.set(!1), y = document.getElementsByTagName("video")[0], Se = $(y), !y) return console.warn("Couldn't find video!");
                y.removeAttribute("controls");
                var o = setTimeout(function() {
                    oe && 0 === y.readyState && (v.log(2, "[video] Loading stalled, skipping loaded check"), n())
                }, 1e3);
                Se.on("loadedmetadata", t), Se.on("canplaythrough", n), y.load(), g(y)
            }

            function h() {
                be.isLoaded.set(!1), Se.off(), Se = null, y = null
            }

            function f() {
                var e = document.createElement("video"),
                    t, n;
                return e.canPlayType ? (t = e.canPlayType("application/x-mpegURL"), n = e.canPlayType("application/vnd.apple.mpegURL"), /probably|maybe/.test(t) || /probably|maybe/.test(n)) : !1
            }

            function g(e) {
                if (0 !== e.networkState && 3 !== e.networkState) {
                    if (0 === e.readyState) {
                        var t = function() {
                            var e = !1,
                                t = function() {
                                    e = !0
                                };
                            Se.on("loadstart", t);
                            var n = function() {
                                e || Se.trigger("loadstart")
                            };
                            return Se.on("loadedmetadata", n), window.setTimeout(function() {
                                Se.off("loadstart", t), Se.off("loadedmetadata", n), e || Se.trigger("loadstart")
                            }, 1), {
                                v: void 0
                            }
                        }();
                        if ("object" == typeof t) return t.v
                    }
                    var n = ["loadstart"];
                    n.push("loadedmetadata"), e.readyState >= 2 && n.push("loadeddata"), e.readyState >= 3 && n.push("canplay"), e.readyState >= 4 && n.push("canplaythrough"), window.setTimeout(function() {
                        n.forEach(function(e) {
                            Se.trigger(e)
                        }, this)
                    }, 1)
                }
            }
            v.player.video = be = {
                isLoaded: new o(!1),
                isLoading: new o(!1),
                isPlaying: !1,
                load: p,
                unload: h,
                play: e,
                ended: n,
                pause: t,
                preloadVideo: u,
                setVolume: c,
                getCurrentTime: a,
                updateFromTime: r,
                updateFromPx: s,
                supportsNativeHls: f()
            };
            var m, y = {},
                w = function() {
                    V.autorun(function() {
                        y.playbackRate = z.get("speed")
                    }), Se.on("waiting", S), Se.on("playing", M), Se.on("stalled", function() {
                        4 !== y.readyState && 2 !== y.networkState && (v.log(1, "[video] Video stalled, lemme fix that..."), y.load(), l(ye.getPercentage()), y.paused && C.is("playing") && y.play())
                    }), Se.on("playing", function() {
                        be.isPlaying || (be.isPlaying = !y.paused)
                    }), Se.on("seeked", function() {
                        function e(e) {
                            "hotkeys" !== V.lastUpdatedBy && "loop" !== V.lastUpdatedBy && de.update()
                        }
                        return e
                    }()), Se.on("ended", n)
                },
                k = i.throttle(r, 50, {
                    leading: !1
                }),
                b = new v.Timer,
                S = function() {
                    b.set(function() {
                        be.isLoading.set(!0)
                    }, 250)
                },
                M = function() {
                    b.clear(), be.isLoading.set(!1)
                }
        }.call(this),
        function() {
            n.__checkName("PlayerIconsCordova"), n.PlayerIconsCordova = new n("Template.PlayerIconsCordova", function() {
                var e = this;
                return A.SVG({
                    style: "position: absolute; width: 0; height: 0;",
                    width: "0",
                    height: "0",
                    version: "1.1",
                    xmlns: "http://www.w3.org/2000/svg",
                    "xmlns:xlink": "http://www.w3.org/1999/xlink"
                }, "\n	", A.DEFS("\n	", A.SYMBOL({
                    id: "icon-player-before-wheel",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    d: "M58.4 18.224c58.944-36.096 137.472-16.992 175.216 43.52l89.152 598.288 630.096 121.040c66.336 42.992 88.128 127.408 47.28 187.936-40.336 59.968-126.912 72.704-192.192 29.184l-672.016-164.016-116.848-642.896c-36.592-59.984-19.056-136.976 39.312-173.056z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-cross",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    d: "M0 94.944l433.072 433.056-433.072 433.056 78.928 78.944 433.072-433.056 433.072 433.056 78.928-78.944-433.072-433.056 433.072-433.056-78.928-78.944-433.072 433.056-433.072-433.056z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-fast-mode",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    d: "M0 735.856c0 17.184 13.712 31.12 30.72 31.12h122.88c16.992 0 30.72-13.936 30.72-31.12 0-17.216-13.712-31.344-30.72-31.344h-91.152c6.768-102.816 47.104-196.4 110.192-269.712l64.128 65.312c6.112 6.16 13.92 9.232 21.68 9.232 7.984 0 15.776-3.072 21.696-9.232 12.080-12.288 12.080-31.936 0-44.224l-64.096-65.344c72.096-63.888 164.064-105.040 265.216-112.016v92.768c0 17.216 13.712 31.12 30.72 31.12s30.72-13.904 30.72-31.12v-92.768c101.152 6.976 193.328 48.128 265.216 112.016l-271.568 276.288c-7.568-2.88-15.76-4.304-24.352-4.304-39.712 0-72.080 32.976-72.080 73.328 0 40.336 32.352 73.088 72.080 73.088s71.872-32.768 71.872-73.088c0-8.816-1.44-16.992-4.080-24.784l271.568-276.272c62.88 73.312 103.424 166.912 110.192 269.712h-91.152c-16.992 0-30.72 13.92-30.72 31.344 0 17.184 13.712 31.12 30.72 31.12h122.88c16.992 0 30.72-13.936 30.72-31.12 0-142.144-56.32-271.376-147.664-365.376-1.648-1.84-3.488-3.888-5.552-5.536-92.352-92.752-219.104-149.904-358.784-149.904s-266.24 57.136-358.8 149.696l-6.16 6.16c-90.912 94.208-147.040 223.024-147.040 364.96z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-flow-mode",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    d: "M363.664 958.688c-65.056 27.664-132.032 17.696-149.2-22.416-17.424-40.144 21.296-94.944 86.352-122.608s131.728-17.712 149.168 22.144c17.168 40.112-21.28 95.2-86.32 122.88zM826.688 3.552c-72.512-19.92-139.488 47.056-188.208 122.88-38.208 58.96-66.16 127.040-80 205.92l-3.6 20.752h-13.536l-59.52 0.288-16.336 48.992 81.088-0.288c-13.296 95.488-12.736 175.2-32.64 300.288-4.176 25.744-8.336 48.176-12.464 68.64-45.104-34.864-128.992-39.568-212.288-6.64-106.56 42.080-171.328 129.248-145.024 194.848 26.56 65.6 133.952 84.416 240.528 42.336 57.296-22.688 102.368-58.672 127.84-97.136 39.856-46.768 68.368-110.144 94.944-227.504 24.352-104.608 47.616-195.12 63.392-276.224l83.296-8.848 21.856-40.128-97.424 0.56 2.784-20.48c17.696-106.288 61.44-250.192 127.856-250.752 38.208 0 45.104 86.064 57.312 105.984 0 0 20.192 11.904 19.072-11.056-4.144-85.808 7.216-154.432-58.928-172.432z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-gear",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    d: "M1019.008 441.296c-1.824-13.216-12.336-23.664-25.648-25.44l-110.96-14.496c-7.536-25.296-17.68-49.76-30.208-72.928l68.272-88.784c8.128-10.608 8.192-25.44 0.112-36.064-28.608-37.808-62.256-71.472-99.968-100-10.384-7.888-25.712-7.824-36.112 0.128l-88.72 68.192c-23.296-12.608-47.824-22.8-73.024-30.304l-14.528-110.96c-1.744-13.248-12.208-23.792-25.44-25.616-48.288-6.672-93.392-6.672-141.392-0.032-13.2 1.824-23.664 12.352-25.44 25.632l-14.512 110.88c-25.328 7.536-49.904 17.696-73.216 30.32l-88.736-68.208c-10.368-7.952-25.664-8.016-36.064-0.144-17.088 12.88-33.824 27.296-49.776 42.912l-7.68 7.696c-15.28 15.6-29.616 32.176-42.56 49.312-8.064 10.656-8 25.504 0.112 36.112l68.256 88.704c-12.672 23.344-22.864 47.92-30.416 73.264l-110.912 14.544c-13.28 1.712-23.808 12.176-25.648 25.424-2.848 20.608-4.464 41.968-4.8 63.6v14.544c0.336 21.328 1.952 42.544 4.8 63.152 1.824 13.216 12.352 23.68 25.648 25.424l110.912 14.496c7.568 25.392 17.76 49.984 30.416 73.28l-68.256 88.656c-8.112 10.608-8.176 25.424-0.112 36.096 13.024 17.216 27.376 33.856 42.784 49.52l7.664 7.696c15.744 15.408 32.432 29.76 49.552 42.672 10.304 7.824 25.776 7.76 36.096-0.144l88.736-68.208c23.312 12.608 47.872 22.768 73.216 30.336l14.512 110.896c1.76 13.232 12.24 23.76 25.44 25.584 23.744 3.28 47.488 4.96 70.496 4.96 23.088 0 46.976-1.664 70.896-4.992 13.248-1.824 23.712-12.368 25.44-25.632l14.528-110.928c25.264-7.552 49.76-17.728 73.024-30.336l88.704 68.192c5.168 3.984 11.632 6.176 18.144 6.176 6.528 0 12.752-2.096 17.984-6.032 37.776-28.576 71.408-62.224 99.968-100.016 8.064-10.656 8-25.488-0.112-36.064l-68.272-88.752c12.512-23.168 22.672-47.648 30.208-72.96l110.96-14.496c13.264-1.744 23.808-12.208 25.648-25.44 3.296-23.888 4.976-47.68 4.976-70.688 0-23.024-1.68-46.816-4.992-70.736zM829.968 588.736c-7.984 33.136-21.056 64.672-38.848 93.712-6.368 10.432-5.648 23.968 1.792 33.664l66.176 86.064c-17.152 20.48-36.192 39.552-56.752 56.784l-86.048-66.144c-9.52-7.328-23.376-8.064-33.696-1.76-29.088 17.84-60.64 30.944-93.744 38.928-11.92 2.864-20.976 12.944-22.544 25.040l-14.064 107.584c-27.136 2.48-53.040 2.48-80.272 0.016l-14.064-107.536c-1.616-12.144-10.688-22.24-22.576-25.024-33.248-8.016-64.848-21.088-93.92-38.928-10.208-6.224-24.128-5.504-33.648 1.792l-86.064 66.144c-9.088-7.616-17.792-15.488-25.936-23.44l-7.248-7.28c-8.256-8.416-16.16-17.12-23.552-25.952l66.128-86.032c7.456-9.696 8.176-23.232 1.776-33.68-17.888-29.2-31.008-60.8-38.976-93.984-2.896-11.904-12.976-20.96-25.088-22.56l-107.568-14.064c-0.992-10.816-1.552-21.936-1.728-33.040v-13.664c0.192-11.28 0.736-22.496 1.696-33.456l107.552-14.064c12.144-1.6 22.224-10.672 25.056-22.544 8-33.216 21.104-64.832 38.976-93.968 6.432-10.448 5.696-24-1.76-33.696l-66.144-86.016c7.536-8.992 15.376-17.616 23.344-25.712l7.264-7.28c8.336-8.176 17.104-16.128 26.16-23.712l86.048 66.16c9.536 7.264 23.424 8.048 33.664 1.776 29.216-17.872 60.832-30.96 93.904-38.928 11.936-2.848 20.992-12.928 22.576-25.040l14.064-107.552c27.232-2.464 53.104-2.448 80.256 0.032l14.096 107.584c1.6 12.112 10.656 22.176 22.512 25.056 33.104 7.984 64.672 21.072 93.776 38.928 10.224 6.272 24.176 5.536 33.68-1.776l86.064-66.128c20.464 17.136 39.536 36.192 56.736 56.736l-66.16 86.080c-7.472 9.712-8.208 23.232-1.792 33.648 17.824 29.168 30.912 60.688 38.816 93.696 2.928 12.080 12.768 20.944 25.088 22.576l107.552 14.048c1.216 13.616 1.824 27.088 1.824 40.16 0 13.552-0.592 27.008-1.76 40.128l-107.584 14.080c-12.144 1.616-22.24 10.688-25.040 22.544z"
                }), "\n		", A.PATH({
                    "class": "path2",
                    d: "M512 697.168c-102.112 0-185.216-83.072-185.216-185.168s83.104-185.168 185.216-185.168 185.216 83.072 185.216 185.168-83.104 185.168-185.216 185.168zM512 381.36c-72.048 0-130.672 58.608-130.672 130.64s58.624 130.64 130.672 130.64 130.672-58.608 130.672-130.64-58.624-130.64-130.672-130.64z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-gear-active",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    d: "M1019.008 441.296c-1.824-13.216-12.336-23.664-25.648-25.44l-110.96-14.496c-7.536-25.296-17.68-49.76-30.208-72.928l68.272-88.784c8.128-10.608 8.192-25.44 0.112-36.064-28.608-37.808-62.256-71.472-99.968-100-10.384-7.888-25.712-7.824-36.112 0.128l-88.72 68.192c-23.296-12.608-47.824-22.8-73.024-30.304l-14.528-110.96c-1.744-13.248-12.208-23.792-25.44-25.616-48.288-6.672-93.392-6.672-141.392-0.032-13.2 1.824-23.664 12.352-25.44 25.632l-14.512 110.88c-25.328 7.536-49.904 17.696-73.216 30.32l-88.736-68.208c-10.368-7.952-25.664-8.016-36.064-0.144-17.088 12.88-33.824 27.296-49.776 42.912l-7.68 7.696c-15.28 15.6-29.616 32.176-42.56 49.312-8.064 10.656-8 25.504 0.112 36.112l68.256 88.704c-12.672 23.344-22.864 47.92-30.416 73.264l-110.912 14.544c-13.28 1.712-23.808 12.176-25.648 25.424-2.848 20.608-4.464 41.968-4.8 63.6v14.544c0.336 21.328 1.952 42.544 4.8 63.152 1.824 13.216 12.352 23.68 25.648 25.424l110.912 14.496c7.568 25.392 17.76 49.984 30.416 73.28l-68.256 88.656c-8.112 10.608-8.176 25.424-0.112 36.096 13.024 17.216 27.376 33.856 42.784 49.52l7.664 7.696c15.744 15.408 32.432 29.76 49.552 42.672 10.304 7.824 25.776 7.76 36.096-0.144l88.736-68.208c23.312 12.608 47.872 22.768 73.216 30.336l14.512 110.896c1.76 13.232 12.24 23.76 25.44 25.584 23.744 3.28 47.488 4.96 70.496 4.96 23.088 0 46.976-1.664 70.896-4.992 13.248-1.824 23.712-12.368 25.44-25.632l14.528-110.928c25.264-7.552 49.76-17.728 73.024-30.336l88.704 68.192c5.168 3.984 11.632 6.176 18.144 6.176 6.528 0 12.752-2.096 17.984-6.032 37.776-28.576 71.408-62.224 99.968-100.016 8.064-10.656 8-25.488-0.112-36.064l-68.272-88.752c12.512-23.168 22.672-47.648 30.208-72.96l110.96-14.496c13.264-1.744 23.808-12.208 25.648-25.44 3.296-23.888 4.976-47.68 4.976-70.688 0-23.024-1.68-46.816-4.992-70.736zM512 697.168c-102.112 0-185.216-83.072-185.216-185.168s83.104-185.168 185.216-185.168 185.216 83.072 185.216 185.168-83.104 185.168-185.216 185.168z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-hand-left",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    d: "M689.216 700.096c0.624 0 66.432-193.152 66.432-193.152 15.184-49.664 62-63.872 98.064-52.192 14.224 4.752 20.56 47.44 23.408 48.432l-99.008 283.328c-42.368 138.192-164.128 233.408-303.28 237.184l-0.608 0.304c-180.304-0.32-326.688-151.76-327.344-338.064l0.32-0.944v-426.912c0-37.68 29.104-58.208 56.624-58.208 14.24 0.336 28.464 6.016 38.912 15.808 7.92 7.6 17.376 20.88 17.376 42.4v310.192c0 6.992 5.68 12.992 12.656 12.992 6.672 0 12.352-6 12.352-12.992v-462.944c0-38 29.088-58.224 56.56-58.224 14.272 0 28.48 5.712 38.912 15.504 8.224 7.568 17.728 21.184 17.424 42.72v458.56c0 6.912 5.68 12.944 12.64 12.944 6.64 0 12.32-6.032 12.32-12.944v-505.68c0-37.952 29.104-58.832 56.656-58.192 14.208 0 28.432 5.68 38.896 15.472 8.224 7.6 17.664 21.216 17.376 43.008v509.136c0 7.296 5.68 12.992 12.656 12.992 6.624 0 12.32-6 12.32-12.992v-419.936c0.336-37.648 29.088-57.872 56.624-57.872 14.224 0 28.464 5.68 38.912 15.504 7.904 7.568 17.344 21.184 17.344 42.672v529.696c0.16 15.536-2.976 24.48 5.504 27.088 7.68 2.4 9.952-4.688 9.952-4.688z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-hand-right",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    d: "M334.784 700.096c-0.624 0-66.432-193.152-66.432-193.152-15.184-49.664-62-63.872-98.064-52.192-14.224 4.752-20.56 47.44-23.408 48.432l99.008 283.328c42.368 138.192 164.128 233.408 303.28 237.184l0.608 0.304c180.32-0.32 326.688-151.76 327.344-338.064l-0.32-0.944v-426.912c0-37.68-29.12-58.208-56.624-58.208-14.256 0.336-28.464 6.016-38.912 15.808-7.904 7.6-17.376 20.88-17.376 42.4v310.192c0 6.992-5.68 12.992-12.656 12.992-6.656 0-12.336-6-12.336-12.992v-462.944c0-38-29.088-58.224-56.56-58.224-14.288 0-28.496 5.712-38.912 15.504-8.256 7.568-17.744 21.184-17.44 42.72v458.56c0 6.912-5.68 12.944-12.624 12.944-6.656 0-12.336-6.032-12.336-12.944v-505.68c0-37.952-29.088-58.832-56.624-58.192-14.224 0-28.432 5.68-38.912 15.472-8.224 7.6-17.664 21.216-17.376 43.008v509.136c0 7.296-5.68 12.992-12.656 12.992-6.624 0-12.32-6-12.32-12.992v-419.936c-0.336-37.648-29.088-57.872-56.624-57.872-14.224 0-28.464 5.68-38.912 15.504-7.904 7.568-17.344 21.184-17.344 42.672v529.696c-0.16 15.536 2.976 24.48-5.504 27.088-7.696 2.4-9.968-4.688-9.968-4.688z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-loop",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    d: "M596.096 308.848h-259.728c-111.552 0-200.992 102.336-200.992 218.16v27.472c0 22.672-10.208 43.136-26.944 56.080-11.312 8.64-25.312 14-40.4 14-31.776 0-58.736-23.68-65.712-54.4 0 0-1.632-6.48-2.16-15.664-0.512-18.336 0.528-3.728 0-5.36-3.264-189.136 153.52-342.144 336.208-342.144h278.032v-134.704c0-9.664 7.52-17.776 16.672-17.776 3.728 0 29.088 1.040 32.352 3.264l205.264 160.528c8.56 7.008 13.984 17.2 13.984 29.088 0 10.736-4.304 19.936-11.824 26.416l-3.776 3.2-201.536 157.904-3.792 2.624c-1.584 1.68-29.040 2.224-30.672 2.224-9.152-0.528-16.672-7.584-16.672-17.776v-113.152z"
                }), "\n		", A.PATH({
                    "class": "path2",
                    d: "M409.616 716.096v-113.136c0-10.208-7.52-17.264-16.672-17.76-1.632 0-29.104 1.072-30.672 2.208l-3.792 2.624-201.536 157.904-3.776 3.2c-7.536 6.48-11.824 15.68-11.824 26.4 0 11.904 5.424 22.096 13.984 29.104l205.264 160.528c3.248 2.208 28.624 3.248 32.352 3.248 9.152 0 16.672-8.112 16.672-17.76v-134.704h278.032c182.688 0 339.488-152.992 336.224-342.112-0.528-1.648 0.512 12.944 0-5.376-0.528-9.2-2.16-15.664-2.16-15.664-6.992-30.736-33.936-54.4-65.696-54.4-15.104 0-29.104 5.36-40.416 14-16.736 12.944-26.944 33.408-26.944 56.080v35.504c0 115.808-89.456 210.096-200.992 210.096h-278.048z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-mic-not-working",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1 fill-color1",
                    fill: "#fff",
                    d: "M451.92 883.184c-104.336-27.872-181.312-126.592-181.312-244.080v-56.56c0-18.816 8.464-17.984 26.4-17.984 17.968 0 27.216-0.832 27.216 17.984v56.56c0 51.248 19.872 97.104 51.808 130.64 32.16 33.536 87.152 67.616 135.936 67.616 48.816 0 103.808-34.080 135.968-67.616 31.936-33.536 51.776-79.392 51.776-130.64v-56.56c0-18.816 8.88-17.984 26.848-17.984s26.816-0.832 26.816 17.984v56.56c0 117.488-76.976 216.208-181.024 244.080l-27.904 4.032c0 1.104-5.632 28.704-5.632 29.488 0 0.688 0 2.032 0 2.72 0 4.624 0 13.872 0 18.512 0 0.672 0 1.984 0 2.672 0 0.784 5.376 28.432 5.632 29.232 1.056 16.336 13.408 2.656 28.72 4.288 17.152 1.888 33.776 4.56 50.128 7.776l0.848 0.272 2.656 0.544c13.44 4.304 23.6 17.424 23.6 33.264 0 7.936-15.008 7.504-33.248 7.504h-210.56c-17.968 0-32.688 3.456-32.688-7.504 0-15.84 9.872-28.976 23.568-33.264h-0.784c17.68-3.76 35.68-6.704 54.16-8.592 15.568-1.632 27.904 11.776 28.976-4.816 0 0 4.72-21.424 5.376-28.704 0.064-0.528 0-1.632 0-2.16 0-4.896 0-14.704 0-19.584 0-0.544 0-1.632 0-2.176 0-0.784-5.376-28.128-5.376-28.976l-27.904-4.528z"
                }), "\n		", A.PATH({
                    "class": "path2 fill-color1",
                    fill: "#fff",
                    d: "M511.984 795.376c-75.408 0-141.584-75.152-141.584-160.832v-242.448c0-82.96 64.848-153.024 141.584-153.024 76.768 0 141.616 70.080 141.616 153.024v242.448c0 85.68-66.176 160.832-141.616 160.832zM511.984 289.568c-51.136 0-94.4 46.96-94.4 102.528v242.448c0 57.728 44.992 110.336 94.4 110.336 49.44 0 94.432-52.592 94.432-110.336v-242.448c0-55.584-43.264-102.528-94.432-102.528z"
                }), "\n		", A.PATH({
                    "class": "path3 fill-color2",
                    fill: "#b21917",
                    d: "M517.744 255.12c0-140.976 114.128-255.12 255.136-255.12s255.12 114.144 255.12 255.12c0 140.992-114.128 255.136-255.12 255.136s-255.136-114.128-255.136-255.136z"
                }), "\n		", A.PATH({
                    "class": "path4 fill-color4",
                    fill: "#fff",
                    d: "M652.032 389.424h34.912c28.992-38.144 57.472-76.544 85.936-115.216l86.464 115.216h34.368c-34.368-44.864-69.28-89.696-103.408-135.072l101.568-133.504h-35.472l-83.536 112c-28.464-37.344-55.872-74.944-84.32-112h-33.6l100.464 132.96-103.376 135.616z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-mic-working",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1 fill-color1",
                    fill: "#fff",
                    d: "M451.92 883.184c-104.336-27.872-181.312-126.592-181.312-244.080v-56.56c0-18.816 8.464-17.984 26.4-17.984 17.968 0 27.216-0.832 27.216 17.984v56.56c0 51.248 19.872 97.104 51.808 130.64 32.16 33.536 87.152 67.616 135.936 67.616 48.816 0 103.808-34.080 135.968-67.616 31.936-33.536 51.776-79.392 51.776-130.64v-56.56c0-18.816 8.88-17.984 26.848-17.984s26.816-0.832 26.816 17.984v56.56c0 117.488-76.976 216.208-181.024 244.080l-27.904 4.032c0 1.104-5.632 28.704-5.632 29.488 0 0.688 0 2.032 0 2.72 0 4.624 0 13.872 0 18.512 0 0.672 0 1.984 0 2.672 0 0.784 5.376 28.432 5.632 29.232 1.056 16.336 13.408 2.656 28.72 4.288 17.152 1.888 33.776 4.56 50.128 7.776l0.848 0.272 2.656 0.544c13.44 4.304 23.6 17.424 23.6 33.264 0 7.936-15.008 7.504-33.248 7.504h-210.56c-17.968 0-32.688 3.456-32.688-7.504 0-15.84 9.872-28.976 23.568-33.264h-0.784c17.68-3.76 35.68-6.704 54.16-8.592 15.568-1.632 27.904 11.776 28.976-4.816 0 0 4.72-21.424 5.376-28.704 0.064-0.528 0-1.632 0-2.16 0-4.896 0-14.704 0-19.584 0-0.544 0-1.632 0-2.176 0-0.784-5.376-28.128-5.376-28.976l-27.904-4.528z"
                }), "\n		", A.PATH({
                    "class": "path2 fill-color1",
                    fill: "#fff",
                    d: "M511.984 795.376c-75.408 0-141.584-75.152-141.584-160.832v-242.448c0-82.96 64.848-153.024 141.584-153.024 76.768 0 141.616 70.080 141.616 153.024v242.448c0 85.68-66.176 160.832-141.616 160.832zM511.984 289.568c-51.136 0-94.4 46.96-94.4 102.528v242.448c0 57.728 44.992 110.336 94.4 110.336 49.44 0 94.432-52.592 94.432-110.336v-242.448c0-55.584-43.264-102.528-94.432-102.528z"
                }), "\n		", A.PATH({
                    "class": "path3 fill-color3",
                    fill: "#5db130",
                    d: "M513.728 255.136c0-140.992 114.144-255.136 255.136-255.136s255.136 114.144 255.136 255.136c0 140.992-114.144 255.12-255.136 255.12-140.992 0.016-255.136-114.128-255.136-255.12z"
                }), "\n		", A.PATH({
                    "class": "path4 fill-color4",
                    fill: "#fff",
                    d: "M723.2 389.424l-128.896-142.896 20.944-23.344 107.952 119.76 199.264-222.096 20.96 23.088z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-mic",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    d: "M451.92 883.184c-104.336-27.872-181.312-126.592-181.312-244.080v-56.56c0-18.816 8.464-17.984 26.4-17.984 17.968 0 27.216-0.832 27.216 17.984v56.56c0 51.248 19.872 97.104 51.808 130.64 32.16 33.536 87.152 67.616 135.936 67.616 48.816 0 103.808-34.080 135.968-67.616 31.936-33.536 51.776-79.392 51.776-130.64v-56.56c0-18.816 8.88-17.984 26.848-17.984s26.816-0.832 26.816 17.984v56.56c0 117.488-76.976 216.208-181.024 244.080l-27.904 4.032c0 1.104-5.632 28.704-5.632 29.488 0 0.688 0 2.032 0 2.72 0 4.624 0 13.872 0 18.512 0 0.672 0 1.984 0 2.672 0 0.784 5.376 28.432 5.632 29.232 1.056 16.336 13.408 2.656 28.72 4.288 17.152 1.888 33.776 4.56 50.128 7.776l0.848 0.272 2.656 0.544c13.44 4.304 23.6 17.424 23.6 33.264 0 7.936-15.008 7.504-33.248 7.504h-210.56c-17.968 0-32.688 3.456-32.688-7.504 0-15.84 9.872-28.976 23.568-33.264h-0.784c17.68-3.76 35.68-6.704 54.16-8.592 15.568-1.632 27.904 11.776 28.976-4.816 0 0 4.72-21.424 5.376-28.704 0.064-0.528 0-1.632 0-2.16 0-4.896 0-14.704 0-19.584 0-0.544 0-1.632 0-2.176 0-0.784-5.376-28.128-5.376-28.976l-27.904-4.528z"
                }), "\n		", A.PATH({
                    "class": "path2",
                    d: "M511.984 795.376c-75.408 0-141.584-75.152-141.584-160.832v-242.448c0-82.96 64.848-153.040 141.584-153.040 76.768 0 141.616 70.080 141.616 153.040v242.448c0 85.68-66.176 160.832-141.616 160.832zM511.984 289.568c-51.136 0-94.4 46.944-94.4 102.528v242.448c0 57.728 44.992 110.336 94.4 110.336 49.44 0 94.432-52.592 94.432-110.336v-242.448c0-55.584-43.264-102.528-94.432-102.528z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-next-wheel",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    d: "M962.4 18.224c-58.944-36.096-137.472-16.992-175.216 43.52l-89.152 598.288-630.096 121.040c-66.336 42.992-88.128 127.408-47.28 187.936 40.336 59.968 126.912 72.704 192.192 29.184l672.032-164.032 116.848-642.896c36.592-59.968 19.056-136.96-39.328-173.040z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-note",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    d: "M868.176 845.904h-219.952c-23.568 50.32-126 96.192-198.096 119.312-110.416 35.216-219.952 2.688-244.864-72.992-4.928-15.12-5.824-30.736-4-46.32h-45.44c-48.992 0-89.040 40.096-89.040 89.040s40.048 89.056 89.040 89.056h712.336c48.992 0 89.040-40.096 89.040-89.040s-40.032-89.056-89.024-89.056z"
                }), "\n		", A.PATH({
                    "class": "path2",
                    d: "M762.224 426.96c-32.096 12.48-7.12-12.432-7.12-12.432s51.2-77.472 12.912-140.256c-30.304-48.96-129.088-39.664-166.96-61.92v524.48c0 1.344-0.432 2.224-0.928 3.568-5.728 56.128-57.824 112.656-136.64 137.616-96.608 30.704-192.352 2.176-214.144-63.264-21.824-65.856 38.704-143.776 135.744-174.512 43.648-14.224 97.52-10.656 126.912-6.656l0.432-610c0-12-3.536-22.688 9.344-22.688l59.216-0.896c12.48 0 22.704 10.256 22.704 22.688v20.048c75.68 37.392 233.296 72.56 258.688 171.872 30.272 119.296-68.56 199.904-100.16 212.352z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-pause",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    d: "M716.8 0c56.304 0 102.4 46.080 102.4 102.4v819.2c0 56.32-46.112 102.4-102.4 102.4s-102.4-46.096-102.4-102.4v-819.2c0-56.32 46.096-102.4 102.4-102.4z"
                }), "\n		", A.PATH({
                    "class": "path2",
                    d: "M307.2 0c56.304 0 102.4 46.080 102.4 102.4v819.2c0 56.32-46.096 102.4-102.384 102.4s-102.4-46.096-102.4-102.4v-819.2c-0.016-56.32 46.096-102.4 102.384-102.4z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-play",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    d: "M854.56 450.576l-564.848-442.048c-8.96-5.12-19.616-8.528-30.704-8.528-31.184 0-56.336 23.92-56.336 53.328v917.36c0 29.408 25.152 53.312 56.336 53.312 11.504 0 22.592-3.44 31.568-9.44l7.68-5.904 556.32-435.232c18.88-14.496 30.784-36.672 30.784-61.424s-11.92-46.928-30.8-61.424z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-rewind",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    d: "M0 512l512 360.304v-720.608l-512 360.304zM1024 151.696v720.592l-512-360.288 512-360.304z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-sheet-view",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    d: "M783.68 881.568c-7.040-27.568-36.4-44.624-65.968-38.256l-205.712 74.88-205.712-74.88c-29.568-6.368-58.928 10.688-65.968 38.256-6.848 27.296 11.6 54.832 40.944 61.44l230.080 80.992 0.656-0.224 0.672 0.224v-0.224l230.080-80.784c29.344-6.608 47.776-34.128 40.928-61.424z"
                }), "\n		", A.PATH({
                    "class": "path2",
                    d: "M170.672 159.296v45.504h250.32v-45.504h-250.32zM739.568 204.8h113.76v-45.504h-113.76v45.504zM170.672 295.824v45.52h250.32v-45.52h-250.32zM684.944 341.328h168.384v-45.52h-141.072l-27.312 45.52zM170.672 432.352v45.504h136.528c0 0 10.16-15.872 22.752-22.752 25.072-13.712 91.024-22.752 91.024-22.752h-250.304zM580.272 477.872h273.056v-45.504h-273.056v45.504z"
                }), "\n		", A.PATH({
                    "class": "path3",
                    d: "M600.288 347.024c-20.448 8.192-4.544-8.192-4.544-8.192s70.096-119.696 45.52-160.432c-19.104-31.856-82.352-25.936-106.496-40.272v398.912c0 0.912-0.432 1.824-0.432 2.736-3.872 36.176-31.424 73.040-81.68 89.424-61.68 19.808-123.104 1.376-136.992-41.408-13.888-42.56 25.040-84.88 86.688-104.912 28.224-9.104 45.28-2.048 64.176 0.672l0.192-463.984c0-7.968-2.048-14.784 5.904-14.784l47.328-4.784c8.208 0 14.8 6.608 14.8 14.576v13.2c48.256 24.336 149.040 47.104 165.2 111.728 19.328 77.808-79.424 199.328-99.664 207.52z"
                }), "\n		", A.PATH({
                    "class": "path4",
                    d: "M783.68 984.432c-7.040 27.568-36.4 44.624-65.968 38.256l-205.712-74.88-205.712 74.88c-29.568 6.368-58.928-10.688-65.968-38.256-6.848-27.296 11.6-54.832 40.944-61.44l230.080-81.008 0.656 0.24 0.672-0.224v0.224l230.080 80.784c29.344 6.608 47.776 34.128 40.928 61.424z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-slow-mode",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    d: "M1024 735.856c0 17.184-13.712 31.12-30.72 31.12h-122.88c-16.992 0-30.72-13.936-30.72-31.12 0-17.216 13.712-31.344 30.72-31.344h91.136c-6.768-102.816-47.104-196.4-110.192-269.712l-64.128 65.312c-6.112 6.16-13.92 9.232-21.68 9.232-7.984 0-15.776-3.072-21.696-9.232-12.080-12.288-12.080-31.936 0-44.224l64.096-65.344c-72.096-63.888-164.064-105.040-265.216-112.016v92.768c0 17.216-13.712 31.12-30.72 31.12s-30.72-13.904-30.72-31.12v-92.768c-101.152 6.976-193.328 48.128-265.216 112.016l271.584 276.288c7.568-2.88 15.76-4.304 24.352-4.304 39.712 0 72.080 32.976 72.080 73.328 0 40.336-32.352 73.088-72.080 73.088s-71.872-32.768-71.872-73.088c0-8.816 1.44-16.992 4.080-24.784l-271.568-276.272c-62.88 73.312-103.424 166.912-110.192 269.712h91.152c16.992 0 30.72 13.92 30.72 31.344 0 17.184-13.712 31.12-30.72 31.12h-122.88c-16.992 0-30.72-13.936-30.72-31.12 0-142.144 56.32-271.376 147.664-365.376 1.648-1.84 3.488-3.888 5.552-5.536 92.352-92.752 219.104-149.904 358.784-149.904s266.24 57.136 358.8 149.696l6.16 6.144c90.912 94.224 147.040 223.040 147.040 364.976z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-speaker",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    d: "M622.368 340.592l-58.4 57.264c29.952 29.184 48.928 69.408 48.928 114.144 0 44.752-18.976 84.976-48.928 114.16l58.4 57.248c44.736-44 72.432-104.656 72.432-171.408 0.016-66.736-27.696-127.408-72.432-171.408z"
                }), "\n		", A.PATH({
                    "class": "path2",
                    d: "M859.408 512c0-111.104-46.304-212-120.976-284.448l-57.664 56.512c59.52 58.368 96.336 138.816 96.336 227.936s-36.816 169.568-96.336 227.936l57.664 56.496c74.672-72.432 120.976-173.328 120.976-284.432z"
                }), "\n		", A.PATH({
                    "class": "path3",
                    d: "M1024 512c0-155.488-64.864-296.592-169.136-398.224l-58.416 56.88c89.888 87.232 145.264 207.856 145.264 341.328s-55.376 254.112-145.264 341.344l58.416 56.88c104.272-101.616 169.136-242.72 169.136-398.208z"
                }), "\n		", A.PATH({
                    "class": "path4",
                    d: "M0 672.816h216.976l235.456 212.752v-747.136l-231.328 212.752h-221.104z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-midi-no-device",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    fill: "#fff",
                    d: "M513.808 540.96h1.264c46.112 0.112 88.864 13.888 120.096 38.32l-0.128 217.728-76 28.32-93.968-0.048-76.224-28.48 0.256-216.704c33.84-25.056 78.24-39.136 124.704-39.136zM513.808 492.96c-62.528 0-125.808 21.104-172.096 64.192-0.128 0.16-0.432 0.384-0.592 0.608l-0.32 272.336 76.128 28.448-0.224 51.456 63.408 0.16-0.144 113.84h63.472v-113.856h63.504l0.064-51.456 76.032-28.32 0.16-272.32c-0.224-0.32-0.4-0.688-0.688-0.928-42.336-42.336-104.336-64.048-167.312-64.192-0.464 0.032-0.928 0.032-1.392 0.032v0z"
                }), "\n		", A.PATH({
                    "class": "path2",
                    fill: "#fff",
                    d: "M677.568 503.104l0.224-249.024h-330.56l-0.512 249.808c49.808-34.16 109.6-50.944 168.624-50.784 58.128 0.24 115.568 16.928 162.224 50zM620.064 318.736v36.128h-60.992v-36.288l60.992 0.16zM404.72 318.496l60.992 0.080-0.064 36.144-61.024-0.096 0.096-36.128zM602.368 380.496l0.064 15.328h-25.776v-15.248l25.712-0.080zM422.256 380.336h25.808l-0.096 15.344h-25.712v-15.344z"
                }), "\n		", A.PATH({
                    "class": "path3",
                    fill: "#eb7f00",
                    d: "M513.744 255.12c0-140.976 114.128-255.12 255.136-255.12s255.12 114.144 255.12 255.12c0 140.992-114.128 255.136-255.12 255.136s-255.136-114.128-255.136-255.136z"
                }), "\n		", A.PATH({
                    "class": "path4",
                    fill: "#fff",
                    d: "M690.944 170.448c3.968-11.248 9.664-21.040 17.088-29.376 7.424-8.32 16.496-14.784 27.264-19.392 10.752-4.608 22.784-6.912 36.096-6.912 12.032 0 22.976 1.728 32.832 5.184 9.84 3.456 18.352 8.432 25.536 14.976s12.736 14.528 16.704 24c3.968 9.488 5.952 20.352 5.952 32.64 0 7.936-0.96 15.040-2.88 21.312-1.92 6.288-4.416 11.968-7.488 17.088s-6.592 9.856-10.56 14.208c-3.968 4.352-8 8.576-12.096 12.672-4.112 3.84-8.144 7.744-12.096 11.712-3.984 3.968-7.568 8.192-10.768 12.672-3.2 4.464-5.744 9.344-7.664 14.592s-2.88 11.184-2.88 17.84v14.992h-32.64v-18.048c0.496-10.752 2.48-19.904 5.952-27.456 3.456-7.568 7.664-14.288 12.672-20.176 4.992-5.872 10.24-11.328 15.728-16.32 5.504-4.992 10.624-10.24 15.36-15.744s8.512-11.584 11.328-18.24 3.968-14.72 3.456-24.192c-1.008-14.080-5.568-25.088-13.632-33.024s-19.008-11.904-32.832-11.904c-9.216 0-17.152 1.664-23.808 4.992s-12.24 7.808-16.704 13.44c-4.48 5.632-7.744 12.288-9.792 19.968-2.048 7.664-3.056 16-3.056 24.96h-32.64c-0.272-13.024 1.6-25.184 5.568-36.464zM790.592 352.864v42.624h-42.624v-42.624h42.624z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-midi-not-working",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    fill: "#fff",
                    d: "M513.808 540.96h1.264c46.112 0.112 88.864 13.888 120.096 38.32l-0.128 217.728-76 28.32-93.968-0.048-76.224-28.48 0.256-216.704c33.84-25.056 78.24-39.136 124.704-39.136zM513.808 492.96c-62.528 0-125.808 21.104-172.096 64.192-0.128 0.16-0.432 0.384-0.592 0.608l-0.32 272.336 76.128 28.448-0.224 51.456 63.408 0.16-0.144 113.84h63.472v-113.856h63.504l0.064-51.456 76.032-28.32 0.16-272.32c-0.224-0.32-0.4-0.688-0.688-0.928-42.336-42.336-104.336-64.048-167.312-64.192-0.464 0.032-0.928 0.032-1.392 0.032v0z"
                }), "\n		", A.PATH({
                    "class": "path2",
                    fill: "#fff",
                    d: "M677.568 503.104l0.224-249.024h-330.56l-0.512 249.808c49.808-34.16 109.6-50.944 168.624-50.784 58.128 0.24 115.568 16.928 162.224 50zM620.064 318.736v36.128h-60.992v-36.288l60.992 0.16zM404.72 318.496l60.992 0.080-0.064 36.144-61.024-0.096 0.096-36.128zM602.368 380.496l0.064 15.328h-25.776v-15.248l25.712-0.080zM422.256 380.336h25.808l-0.096 15.344h-25.712v-15.344z"
                }), "\n		", A.PATH({
                    "class": "path3",
                    fill: "#b21917",
                    d: "M513.744 255.12c0-140.976 114.128-255.12 255.136-255.12s255.12 114.144 255.12 255.12c0 140.992-114.128 255.136-255.12 255.136s-255.136-114.128-255.136-255.136z"
                }), "\n		", A.PATH({
                    "class": "path4",
                    fill: "#fff",
                    d: "M648.032 389.424h34.912c28.992-38.144 57.472-76.544 85.936-115.216l86.464 115.216h34.368c-34.368-44.864-69.28-89.696-103.408-135.072l101.568-133.504h-35.472l-83.536 112c-28.464-37.344-55.872-74.944-84.32-112h-33.6l100.464 132.96-103.376 135.616z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-midi-working",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    fill: "#fff",
                    d: "M513.808 540.96h1.264c46.112 0.112 88.864 13.888 120.096 38.32l-0.128 217.728-76 28.32-93.968-0.048-76.224-28.48 0.256-216.704c33.84-25.056 78.24-39.136 124.704-39.136zM513.808 492.96c-62.528 0-125.808 21.104-172.096 64.192-0.128 0.16-0.432 0.384-0.592 0.608l-0.32 272.336 76.128 28.448-0.224 51.456 63.408 0.16-0.144 113.84h63.472v-113.856h63.504l0.064-51.456 76.032-28.32 0.16-272.32c-0.224-0.32-0.4-0.688-0.688-0.928-42.336-42.336-104.336-64.048-167.312-64.192-0.464 0.032-0.928 0.032-1.392 0.032v0z"
                }), "\n		", A.PATH({
                    "class": "path2",
                    fill: "#fff",
                    d: "M677.568 503.104l0.224-249.024h-330.56l-0.512 249.808c49.808-34.16 109.6-50.944 168.624-50.784 58.128 0.24 115.568 16.928 162.224 50zM620.064 318.736v36.128h-60.992v-36.288l60.992 0.16zM404.72 318.496l60.992 0.080-0.064 36.144-61.024-0.096 0.096-36.128zM602.368 380.496l0.064 15.328h-25.776v-15.248l25.712-0.080zM422.256 380.336h25.808l-0.096 15.344h-25.712v-15.344z"
                }), "\n		", A.PATH({
                    "class": "path3",
                    fill: "#5db130",
                    d: "M513.728 255.136c0-140.992 114.144-255.136 255.136-255.136s255.136 114.144 255.136 255.136c0 140.992-114.144 255.12-255.136 255.12-140.992 0.016-255.136-114.128-255.136-255.12z"
                }), "\n		", A.PATH({
                    "class": "path4",
                    fill: "#fff",
                    d: "M723.2 389.424l-128.896-142.896 20.944-23.344 107.952 119.76 199.264-222.096 20.96 23.088z"
                }), "\n	"), "\n	", A.SYMBOL({
                    id: "icon-player-midi",
                    viewBox: "0 0 1024 1024"
                }, "\n		", A.PATH({
                    "class": "path1",
                    fill: "#fff",
                    d: "M513.808 540.96h1.264c46.112 0.112 88.864 13.888 120.096 38.32l-0.128 217.728-76 28.32-93.968-0.048-76.224-28.48 0.256-216.704c33.84-25.056 78.24-39.136 124.704-39.136zM513.808 492.96c-62.528 0-125.808 21.104-172.096 64.192-0.128 0.16-0.432 0.384-0.592 0.608l-0.32 272.336 76.128 28.448-0.224 51.456 63.408 0.16-0.144 113.84h63.472v-113.856h63.504l0.064-51.456 76.032-28.32 0.16-272.32c-0.224-0.32-0.4-0.688-0.688-0.928-42.336-42.336-104.336-64.048-167.312-64.192-0.464 0.032-0.928 0.032-1.392 0.032v0z"
                }), "\n		", A.PATH({
                    "class": "path2",
                    fill: "#fff",
                    d: "M677.568 503.104l0.224-249.024h-330.56l-0.512 249.808c49.808-34.16 109.6-50.944 168.624-50.784 58.128 0.24 115.568 16.928 162.224 50zM620.064 318.736v36.128h-60.992v-36.288l60.992 0.16zM404.72 318.496l60.992 0.080-0.064 36.144-61.024-0.096 0.096-36.128zM602.368 380.496l0.064 15.328h-25.776v-15.248l25.712-0.080zM422.256 380.336h25.808l-0.096 15.344h-25.712v-15.344z"
                }), "\n	"), "\n	"), "\n	")
            })
        }.call(this),
        function() {
            n.__checkName("PlayerIcon"), n.PlayerIcon = new n("Template.PlayerIcon", function() {
                var e = this;
                return A.SVG({
                    "class": function() {
                        return ["player-icon player-icon-", x.mustache(e.lookup("getIconName"))]
                    }
                }, A.USE({
                    "xlink:href": function() {
                        return [x.mustache(e.lookup("getFileName")), "#icon-player-", x.mustache(e.lookup("getIconName"))]
                    }
                }))
            })
        }.call(this),
        function() {
            n.PlayerIcon.helpers({
                getFileName: function() {
                    return e.isCordova ? "" : "/packages/flow-player/images/player-icons.svg"
                },
                getIconName: function() {
                    return this.name ? this.name : this
                }
            })
        }.call(this),
        function() {
            n.__checkName("flow_setup"), n.flow_setup = new n("Template.flow_setup", function() {
                var e = this;
                return P.Unless(function() {
                    return x.call(e.lookup("firefox"))
                }, function() {
                    return ["\n	", A.DIV({
                        id: "mcstp"
                    }, "\n		", A.DIV({
                        id: "mcstp-bg"
                    }, "\n		"), "\n\n		", A.DIV({
                        "class": "message"
                    }, "\n\n			", P.View("lookup:micText", function() {
                        return x.mustache(e.lookup("micText"))
                    }), "\n\n			", A.DIV({
                        id: "getmic_descricption"
                    }, "\n				", P.View("lookup:t", function() {
                        return x.mustache(e.lookup("t"), "player.getmicdesc")
                    }), "\n			"), "\n		"), "\n\n		", A.DIV({
                        id: "flow_setup",
                        "class": function() {
                            return x.mustache(e.lookup("isFlash"))
                        }
                    }, "\n			", A.DIV({
                        id: "getmic-image"
                    }), "\n			", A.A({
                        "class": "flow-close"
                    }, P.View("lookup:t", function() {
                        return x.mustache(e.lookup("t"), "player.withoutmic")
                    })), "\n		"), "\n	"), "\n	"]
                })
            })
        }.call(this),
        function() {
            n.flow_setup.onCreated(function() {
                this.firefoxOldMessageFallback = new o(!1)
            }), n.flow_setup.onRendered(function() {
                y.firefox && (this.firefoxOldMessageFallback.set(!1), setTimeout(function() {
                    "loading" === v.audioManager.inputStatus.curValue ? v.micMidiSetup.isVisible.get() || (v.micMidiSetup.show(), r.autorun(function(e) {
                        var t = v.audioManager.inputStatus.get();
                        "ready" === t && (v.micMidiSetup.hide(), e.stop())
                    })) : this.firefoxOldMessageFallback.set(!0)
                }, 400))
            }), n.flow_setup.events({
                "click .flow-close": function(e, t) {
                    v.audioManager.inputStatus.set("disabled")
                }
            }), n.flow_setup.helpers({
                isFlash: function() {
                    var e = z.get("micType");
                    return "flash" === e ? "flash" : void 0
                },
                micText: function() {
                    var e = z.get("micType");
                    return v.lang.get("flash" === e ? "player.micFlash" : y.firefox ? "player.micFirefox" : "player.micaccept")
                },
                firefox: function() {
                    var e = n.instance().firefoxOldMessageFallback.get();
                    return y.firefox && !e ? !0 : void 0
                }
            })
        }.call(this),
        function() {
            n.__checkName("ModeSelector"), n.ModeSelector = new n("Template.ModeSelector", function() {
                var e = this;
                return A.DIV({
                    id: "mode-selector",
                    "class": function() {
                        return ["random-bg ", x.mustache(e.lookup("learnBoxActive"))]
                    }
                }, "\n        ", P.Unless(function() {
                    return x.call(e.lookup("isFirstMode"))
                }, function() {
                    return A.DIV({
                        "class": "icon-position prev step-control"
                    }, P._TemplateWith(function() {
                        return "before-wheel"
                    }, function() {
                        return x.include(e.lookupTemplate("PlayerIcon"))
                    }))
                }), "\n        ", P.Unless(function() {
                    return x.call(e.lookup("isLastMode"))
                }, function() {
                    return A.DIV({
                        "class": "icon-position next step-control"
                    }, P._TemplateWith(function() {
                        return "next-wheel"
                    }, function() {
                        return x.include(e.lookupTemplate("PlayerIcon"))
                    }))
                }), "\n    \n        ", A.DIV({
                    id: "mode-selector-circle"
                }, "\n            ", A.DIV({
                    "class": "centered-block"
                }, "\n                ", A.DIV({
                    "class": "mode-wrapper",
                    id: "stepMode-2"
                }, "\n                    ", A.DIV({
                    "class": "mode"
                }, "\n                        ", A.DIV({
                    "class": function() {
                        return ["icon-position ", x.mustache(e.lookup("getSprite"), 2)]
                    }
                }, P._TemplateWith(function() {
                    return "flow-mode"
                }, function() {
                    return x.include(e.lookupTemplate("PlayerIcon"))
                })), "\n                    "), "\n                    ", A.SPAN({
                    "class": "desc"
                }, P.View("lookup:t", function() {
                    return x.mustache(e.lookup("t"), "player.modes.flowMode")
                })), "\n                "), "\n                ", A.DIV({
                    "class": "mode-wrapper",
                    id: "stepMode-3"
                }, "\n                    ", A.DIV({
                    "class": "mode"
                }, "\n                        ", A.DIV({
                    "class": function() {
                        return ["icon-position ", x.mustache(e.lookup("getSprite"), 3)]
                    }
                }, P._TemplateWith(function() {
                    return "slow-mode"
                }, function() {
                    return x.include(e.lookupTemplate("PlayerIcon"))
                })), "\n                    "), "\n                    ", A.SPAN({
                    "class": "desc"
                }, P.View("lookup:t", function() {
                    return x.mustache(e.lookup("t"), "player.modes.slowPractice")
                })), "\n                "), "\n                ", A.DIV({
                    "class": "mode-wrapper",
                    id: "stepMode-4"
                }, "\n                    ", A.DIV({
                    "class": "mode"
                }, "\n                        ", A.DIV({
                    "class": function() {
                        return ["icon-position ", x.mustache(e.lookup("getSprite"), 4)]
                    }
                }, P._TemplateWith(function() {
                    return "fast-mode"
                }, function() {
                    return x.include(e.lookupTemplate("PlayerIcon"))
                })), "\n                    "), "\n                    ", A.SPAN({
                    "class": "desc"
                }, P.View("lookup:t", function() {
                    return x.mustache(e.lookup("t"), "player.modes.fastPractice")
                })), "\n                "), "\n            "), "\n        "), "\n    ")
            }), n.__checkName("ModeSelectorInfo"), n.ModeSelectorInfo = new n("Template.ModeSelectorInfo", function() {
                var e = this;
                return A.DIV({
                    id: "mode-selector-info"
                }, "\n        ", A.DIV({
                    "class": "hand-info"
                }, P.View("lookup:getHand", function() {
                    return x.mustache(e.lookup("getHand"))
                })), "\n\n        ", A.DIV({
                    "class": "step-info"
                }, P.View("lookup:learnstatus", function() {
                    return x.mustache(e.lookup("learnstatus"))
                })), "\n        ", A.UL({
                    id: "indicators"
                }, "\n            ", A.LI({
                    "class": function() {
                        return ["indicator stepMode-2 ", x.mustache(e.lookup("getActiveMode"), 2)]
                    }
                }), "\n            ", A.LI({
                    "class": function() {
                        return ["indicator stepMode-3 ", x.mustache(e.lookup("getActiveMode"), 3)]
                    }
                }), "\n            ", A.LI({
                    "class": function() {
                        return ["indicator stepMode-4 ", x.mustache(e.lookup("getActiveMode"), 4)]
                    }
                }), "\n        "), "\n    ")
            })
        }.call(this),
        function() {
            n.ModeSelector.onRendered(function() {
                function e(e, n) {
                    var i = t(e);
                    o(i, n)
                }

                function t(e) {
                    return 0 > e ? 0 : (e - a) * -r
                }

                function o(e, t) {
                    var n = l.getRotation();
                    i.setSelectorCircleStylesForAngle(e), l.$el.velocity({
                        rotateZ: [e, n]
                    }, t, [200, 20])
                }
                var i = this,
                    a = 2,
                    r = 90,
                    s = 10,
                    l = this.modeCircle3d = h(i.$("#mode-selector-circle .centered-block"));
                l.SimpleDrag({
                    animatedProperty: "rotation",
                    multiplier: .65,
                    min: -(r * a + s),
                    max: 0 + s,
                    onStart: function() {
                        l.$el.velocity("stop")
                    },
                    onUpdate: function(e) {
                        i.setSelectorCircleStylesForAngle(e)
                    },
                    onEnd: function(e) {
                        var t = Math.round(-e / r) + a;
                        z.set("waitMode", t)
                    }
                });
                var c = i.$("span.desc");
                i.setSelectorCircleStylesForAngle = function(e) {
                    function t(e, t, n, o) {
                        return -t * (Math.sqrt(1 - (n /= o) * n) - 1) + e
                    }

                    function n(e, t, n, o) {
                        return t * Math.sqrt(1 - (n = n / o - 1) * n) + e
                    }
                    e = -e, 0 > e && (e = 0), r > e ? (c[0].style.opacity = String(1 - n(0, 1, e, r)), c[1].style.opacity = String(t(0, 1, e, r)), c[2].style.opacity = null) : (e -= r, c[0].style.opacity = null, c[1].style.opacity = String(1 - n(0, 1, e, r)), c[2].style.opacity = String(t(0, 1, e, r)))
                }, n.ModeSelector.updateUIForMode = e, e(z.get("waitMode"), 0)
            }), n.ModeSelector.onDestroyed(function() {
                this.modeCircle3d && this.modeCircle3d.destroy()
            }), n.ModeSelector.events({
                "click .flow_close": function() {
                    z.set("hand", "none")
                },
                "click .step-control.next": function() {
                    var e = z.get("waitMode");
                    4 > e && z.set("waitMode", e + 1)
                },
                "click .step-control.prev": function() {
                    var e = z.get("waitMode");
                    e > 2 && z.set("waitMode", e - 1)
                }
            }), n.ModeSelector.helpers({
                learnBoxActive: function() {
                    return z.get("waitMode") > 0 ? "active" : void 0
                },
                isFirstMode: function() {
                    return z.get("waitMode") <= 2
                },
                isLastMode: function() {
                    return z.get("waitMode") > 3
                },
                getSprite: function(e) {
                    switch (e) {
                        case 2:
                            return "step-wait";
                        case 3:
                            return "step-slow";
                        case 4:
                            return "step-fast"
                    }
                }
            }), n.ModeSelectorInfo.helpers({
                getActiveMode: function(e) {
                    return e === z.get("waitMode") && "active"
                },
                getHand: function() {
                    var e = z.get("hand");
                    return "right" == e ? v.lang.get("player.hands.right") : "left" == e ? v.lang.get("player.hands.left") : "both" == e ? v.lang.get("player.hands.both") : void 0
                },
                learnstatus: function() {
                    var e = z.get("waitMode");
                    switch (e) {
                        case 2:
                            return v.lang.get("player.modes.flowMode");
                        case 3:
                            return v.lang.get("player.modes.slowPractice");
                        case 4:
                            return v.lang.get("player.modes.fastPractice");
                        default:
                            return "Lernschritt"
                    }
                }
            }), z.afterSet("waitMode", function(e, t) {
                n.ModeSelector.updateUIForMode && t > 0 && n.ModeSelector.updateUIForMode(t, 600)
            })
        }.call(this),
        function() {
            n.__checkName("load_bars"), n.load_bars = new n("Template.load_bars", function() {
                var e = this;
                return A.Raw('<div class="load_bars loaded">\n		<div class="bar"></div>\n		<div class="bar"></div>\n		<div class="bar"></div>\n		<div class="bar"></div>\n		<div class="bar"></div>\n	</div>')
            })
        }.call(this),
        function() {
            n.__checkName("FlowPlayerLoadingScreen"), n.FlowPlayerLoadingScreen = new n("Template.FlowPlayerLoadingScreen", function() {
                var e = this;
                return A.DIV({
                    id: "loading-screen"
                }, "\n		", A.DIV({
                    "class": "inner"
                }, "\n\n			", x.include(e.lookupTemplate("load_bars")), "\n\n			", A.DIV({
                    "class": "loadStatus"
                }, "\n				", A.P({
                    "class": function() {
                        return x.mustache(e.lookup("loadingStatus"), "sync")
                    }
                }, "\n					", P.If(function() {
                    return x.dataMustache(e.lookup("componentIsLoaded"), "sync")
                }, function() {
                    return ["\n						", P.View("lookup:t", function() {
                        return x.mustache(e.lookup("t"), "player.loaded.player")
                    }), "\n					"]
                }, function() {
                    return ["\n						", P.View("lookup:t", function() {
                        return x.mustache(e.lookup("t"), "player.loading.player")
                    }), "\n					"]
                }), "\n				"), "\n\n				", A.P({
                    "class": function() {
                        return x.mustache(e.lookup("loadingStatus"), "sheet")
                    }
                }, "\n					", P.If(function() {
                    return x.dataMustache(e.lookup("componentIsLoaded"), "sheet")
                }, function() {
                    return ["\n						", P.View("lookup:t", function() {
                        return x.mustache(e.lookup("t"), "player.loaded.notes")
                    }), "\n					"]
                }, function() {
                    return ["\n						", P.View("lookup:t", function() {
                        return x.mustache(e.lookup("t"), "player.loading.notes")
                    }), "\n					"]
                }), "\n				"), "\n\n				", A.P({
                    "class": function() {
                        return x.mustache(e.lookup("loadingStatus"), "video")
                    }
                }, "\n					", P.If(function() {
                    return x.dataMustache(e.lookup("componentIsLoaded"), "video")
                }, function() {
                    return ["\n						", P.View("lookup:t", function() {
                        return x.mustache(e.lookup("t"), "player.loaded.video")
                    }), "\n					"]
                }, function() {
                    return ["\n						", P.View("lookup:t", function() {
                        return x.mustache(e.lookup("t"), "player.loading.video")
                    }), "\n					"]
                }), "\n				"), "\n			"), "\n\n			", P.If(function() {
                    return x.call(e.lookup("takingToLong"))
                }, function() {
                    return ["\n				", A.DIV({
                        "class": "takingToLong"
                    }, "\n					", A.P("Player not loading?"), "\n					", A.A({
                        "class": "flow-primary flow-hollow bevel reload"
                    }, "Reload"), "\n				"), "\n			"]
                }), "\n		"), "\n	")
            })
        }.call(this),
        function() {
            n.FlowPlayerLoadingScreen.helpers({
                loadingStatus: function(e) {
                    return V[e].isLoaded.get() ? "finished" : "unfinished"
                },
                componentIsLoaded: function(e) {
                    return V[e].isLoaded.get()
                },
                takingToLong: function() {
                    var e = n.instance();
                    return e.takingToLong.get()
                }
            }), n.FlowPlayerLoadingScreen.events({
                "click .reload": function() {
                    document.location.reload()
                }
            }), n.FlowPlayerLoadingScreen.created = function() {
                this.takingToLong = new o(!1)
            }, n.FlowPlayerLoadingScreen.rendered = function() {
                var e = this;
                this.timeout = setTimeout(function() {
                    V.isLoaded.get() || e.takingToLong.set(!0)
                }, 6e3)
            }, n.FlowPlayerLoadingScreen.destroyed = function() {
                clearTimeout(this.timeout)
            }, e.startup(function() {
                P._globalHelpers && !P._globalHelpers.t && n.registerHelper("t", function(e) {
                    return e
                })
            })
        }.call(this),
        function() {
            n.__checkName("SongInfo"), n.SongInfo = new n("Template.SongInfo", function() {
                var e = this;
                return [A.DIV({
                    id: "flat-song-artist",
                    "class": "abs"
                }, P.View("lookup:subtitle", function() {
                    return x.mustache(e.lookup("subtitle"))
                }), "  ", P.If(function() {
                    return x.call(e.lookup("arrangement"))
                }, function() {
                    return [" - Arrangement by ", P.View("lookup:arrangement", function() {
                        return x.mustache(e.lookup("arrangement"))
                    }), " "]
                })), "\n", A.DIV({
                    id: "flat-song-info",
                    "class": "abs"
                }, P.View("lookup:title", function() {
                    return x.mustache(e.lookup("title"))
                }))]
            })
        }.call(this),
        function() {
            n.__checkName("FlowPlayerHeader"), n.FlowPlayerHeader = new n("Template.FlowPlayerHeader", function() {
                var e = this;
                return A.DIV({
                    id: "head-menu"
                }, "\n	", P.If(function() {
                    return x.dataMustache(e.lookup("state"), "paused", "readyToLoop")
                }, function() {
                    return ["\n	", A.DIV({
                        id: "upperControl"
                    }, "\n		", P._TemplateWith(function() {
                        return {
                            template: x.call(e.lookup("getHeaderTemplate")),
                            data: x.call(e.lookup("getHeaderData"))
                        }
                    }, function() {
                        return x.include(function() {
                            return x.call(n.__dynamic)
                        })
                    }), "\n	"), "\n	\n	", A.DIV({
                        id: "settings-icon"
                    }, "\n		", P._TemplateWith(function() {
                        return x.call(e.lookup("settingsIcon"))
                    }, function() {
                        return x.include(e.lookupTemplate("PlayerIcon"))
                    }), "\n	"), "\n	"]
                }), "\n\n\n	", P.If(function() {
                    return x.call(e.lookup("showMicrophoneStatusIcon"))
                }, function() {
                    return ["\n	", A.DIV({
                        id: "mic-status",
                        "class": "abs icon-position"
                    }, "\n		", P._TemplateWith(function() {
                        return x.call(e.lookup("micSVGClass"))
                    }, function() {
                        return x.include(e.lookupTemplate("PlayerIcon"))
                    }), "\n		", P.If(function() {
                        return x.call(e.lookup("inputIsReady"))
                    }, function() {
                        return ["\n		", A.DIV({
                            id: "volume",
                            style: function() {
                                return ["transform:scale3d(1, ", x.mustache(e.lookup("inputLevel")), ", 1);-webkit-transform:scale3d(1, ", x.mustache(e.lookup("inputLevel")), ", 1)"]
                            },
                            "class": function() {
                                return ["accelerate3d ", x.mustache(e.lookup("currentInputType"))]
                            }
                        }), "\n		"]
                    }), "\n	"), "\n	"]
                }), "\n")
            })
        }.call(this),
        function() {
            n.FlowPlayerHeader.onCreated(function() {
                var t = this;
                this.settingsOpen = new o(!1), this.showDefaultIcon = function() {
                    return C && C.is(["waiting", "playing"])
                }, this.getMicClass = function(e) {
                    if (C && C.is(["waiting", "playing"])) return "mic";
                    switch (e) {
                        case "loading":
                            return "mic";
                        case "unloaded":
                            return "mic";
                        case "ready":
                            return "mic-working";
                        default:
                            return "mic-not-working"
                    }
                }, this.getMidiClass = function(e) {
                    if (C && C.is(["waiting", "playing"])) return "midi";
                    switch (e) {
                        case "loading":
                            return "midi-no-device";
                        case "unloaded":
                            return "midi-no-device";
                        case "noSource":
                            return "midi-no-device";
                        case "rejected":
                            return "midi-not-working";
                        case "ready":
                            return "midi-working";
                        default:
                            return "midi-not-working"
                    }
                }, this.getPopoverItems = function() {
                    var n = [];
                    return e.isCordova || n.push({
                        title: t.getFullScreenText(),
                        "class": "fullscreen",
                        priority: 0
                    }), n.push({
                        title: t.getNoteNameToggleText(),
                        "class": "note-names",
                        priority: 10
                    }), v.version.number.get() > 1 && (n.push({
                        title: v.lang.get("playerSettings.midi"),
                        "class": "midi-connection",
                        priority: 20
                    }), n.push({
                        title: v.lang.get("playerSettings.mic"),
                        "class": "mic-settings",
                        priority: 21
                    })), n.push({
                        title: v.lang.get("playerSettings.support"),
                        "class": "support",
                        priority: 30
                    }), n = t.addItemsFromPlayerOptions(n), n.sort(function(e, t) {
                        return e.priority - t.priority
                    }), n
                }, this.addItemsFromPlayerOptions = function(e) {
                    var t = v.findIn(V.options, "settingsMenu.addItems");
                    if (t) {
                        for (var n = t, o = Array.isArray(n), a = 0, n = o ? n : n[b.iterator]();;) {
                            if (o) {
                                if (a >= n.length) break;
                                Me = n[a++]
                            } else {
                                if (a = n.next(), a.done) break;
                                Me = a.value
                            }
                            i.isFunction(Me.title) && (Me.titleFunc = Me.title), Me.titleFunc && (Me.title = Me.titleFunc())
                        }
                        return e.concat(t)
                    }
                    return e
                }, this.showPopover = function() {
                    var e = t.find("#settings-icon");
                    t.settingsOpen.set(!0), t.popover = d.show({
                        id: "player-settings-popover",
                        direction: "top",
                        template: "iosListView",
                        classes: "dark",
                        data: {
                            items: t.getPopoverItems()
                        },
                        button: e,
                        onHide: function() {
                            t.settingsOpen.set(!1)
                        }
                    })
                }, this.getFullScreenText = function() {
                    return v.lang.get(window.BigScreen ? BigScreen.reactiveFullscreen.get() === !0 ? "playerSettings.fullscreenStop" : "playerSettings.fullscreenStart" : "playerSettings.fullscreenStart")
                }, this.getNoteNameToggleText = function() {
                    var e = v.profile.get("noteNamesVisible");
                    return v.lang.get(e ? "playerSettings.hideNoteNames" : "playerSettings.showNoteNames")
                }
            }), n.FlowPlayerHeader.events({
                "click #settings-icon": function(e, t) {
                    t.showPopover()
                },
                "click #mic-status": function() {
                    v.micMidiSetup && v.micMidiSetup.show()
                }
            }), n.iosPopover.events({
                "click #player-settings-popover .fullscreen": function() {
                    window.BigScreen && (BigScreen.toggle(), d.hide())
                },
                "click #player-settings-popover .support": function() {
                    v.support.showIntercomNewMessage(), d.hide()
                },
                "click #player-settings-popover .midi-connection": function() {
                    v.micMidiSetup && (v.micMidiSetup.midiController.showMidiSetup(), d.hide())
                },
                "click #player-settings-popover .mic-settings": function() {
                    v.micMidiSetup && (v.micMidiSetup.micController.showMicSetup(), d.hide())
                },
                "click #player-settings-popover .start-tour": function() {
                    d.hide(), v.player.pSm.can("pause") && v.player.pSm.pause(), v.player.tour()
                },
                "click #player-settings-popover .note-names": function() {
                    n.piano.toggleNoteNames(), d.hide()
                }
            }), n.FlowPlayerHeader.helpers({
                settingsIcon: function() {
                    return n.instance().settingsOpen.get() ? "gear-active" : "gear"
                },
                fullscreen: function() {
                    return a.get("fullscreen") ? "fullscreen_close" : "fullscreen_open"
                },
                getHeaderData: function() {
                    var e = n.currentData();
                    return v.findIn(e, "options.upperControl.data")
                },
                getHeaderTemplate: function() {
                    var e = n.currentData(),
                        t = v.findIn(e, "options.upperControl.template") || null;
                    return t
                },
                inputLevel: function() {
                    return v.inputManager.getCurrentInputLevel()
                },
                isCordova: function() {
                    return e.isCordova
                },
                micSVGClass: function() {
                    var e = n.instance(),
                        t = v.inputManager.getCurrentInputStatus(),
                        o = v.inputManager.inputType.get();
                    return "midi" === o ? e.getMidiClass(t) : e.getMicClass(t)
                },
                inputIsReady: function() {
                    var e = v.inputManager.inputType.get(),
                        t = v.inputManager.getCurrentInputStatus(),
                        n = "ready" === t && "midi" === e,
                        o = z.get("wait") && C && !C.is("paused") && !C.is("readyToLoop");
                    return n || o
                },
                currentInputType: function() {
                    return v.inputManager.inputType.get()
                },
                showMicrophoneStatusIcon: function() {
                    v.player.isLoaded.dep.depend();
                    var e = z.get("wait"),
                        t = C && C.is(["playing", "waiting"]);
                    return C && !C.is("looping") && !t || e
                },
                state: function() {
                    return n.FlowPlayer.stateIsActive.apply(this, arguments)
                }
            })
        }.call(this),
        function() {
            n.__checkName("DymicSheetStyles"), n.DymicSheetStyles = new n("Template.DymicSheetStyles", function() {
                var e = this;
                return A.STYLE({
                    type: "text/css"
                }, "\n		#flat-noten-bg {\n			height: ", P.View("lookup:sheetWrapperSize", function() {
                    return x.mustache(e.lookup("sheetWrapperSize"))
                }), "px !important;\n		}\n		#flat-noten-bg #sheet img, #flat-noten-bg .accidental img {\n			top: ", P.View("lookup:topOffset", function() {
                    return x.mustache(e.lookup("topOffset"))
                }), "px;\n		}\n		.sheetHeight{\n			height: ", P.View("lookup:sheetWrapperSize", function() {
                    return x.mustache(e.lookup("sheetWrapperSize"))
                }), "px !important;\n		}\n		.bottomAboveSheet{\n			bottom: ", P.View("lookup:aboveSheet", function() {
                    return x.mustache(e.lookup("aboveSheet"))
                }), "px !important;\n		}\n		#mode-selector{\n			bottom: ", P.View("lookup:modeSelector", function() {
                    return x.mustache(e.lookup("modeSelector"))
                }), "px !important;\n		}\n		#selectorElement, #secondPositionMarker{\n			height:  ", P.View("lookup:insideSheet", function() {
                    return x.mustache(e.lookup("insideSheet"))
                }), "px !important;\n		}\n	")
            })
        }.call(this),
        function() {
            n.DymicSheetStyles.onCreated(function() {
                this.sheetWrapperHeight = new o(250), this.sheetHeight = new o, this.middleOffset = new o, this.oldSheetWrapperHeight = new o, this.sheetWrapperInnerHeight = new o, this.progressBarHeight = new o, this.readSheetInformation = function() {
                    var e = n.currentData();
                    this.sheetData = e.musicsheets_v2, this.trimResults = this.sheetData.trimResults, this.originalHeight = this.sheetData.files.pngDimensions.full.height, this.renderedDPI = n.FlowSheet.renderDPI.get(), this.scaleFactor = this.renderedDPI / 300;
                    var t = (this.originalHeight - this.trimResults[300].trimBottom - this.trimResults[300].trimTop) * this.scaleFactor;
                    this.sheetHeight.set(t)
                }, this.readOldHeightValues = function() {
                    this.oldSheetWrapperHeight.set(jQuery("#flat-noten-bg").outerHeight()), this.sheetWrapperInnerHeight.set(jQuery("#flat-noten-bg").height()), this.progressBarHeight.set(jQuery("#flat-timebar").outerHeight())
                }, this.calculateMiddleOffset = function() {
                    var e = this.sheetData.boxInfo.vertMiddle * this.scaleFactor,
                        t = e - this.trimResults[300].trimTop * this.scaleFactor,
                        n = this.sheetHeight.get() / 2,
                        o = n - t;
                    this.middleOffset.set(o)
                }, this.calculateSheetWrapperHeight = function() {
                    var e = this.sheetHeight.get() + 30 + Math.abs(this.middleOffset.get());
                    e = Math.max(e, 250), e = Math.round(e), e = e % 2 === 0 ? e : e + 1, this.sheetWrapperHeight.set(e)
                }
            }), n.DymicSheetStyles.onRendered(function() {
                var e = this;
                this.autorun(function() {
                    v.log(1, "[FlowSheet] Recalculating sheet positions"), e.readSheetInformation(), e.readOldHeightValues(), e.calculateMiddleOffset(), e.calculateSheetWrapperHeight()
                })
            }), n.DymicSheetStyles.helpers({
                sheetWrapperSize: function() {
                    var e = n.instance();
                    return e.sheetWrapperHeight.get()
                },
                topOffset: function() {
                    var e = n.instance();
                    return (e.sheetWrapperHeight.get() - e.sheetHeight.get()) / 2 + e.middleOffset.get()
                },
                aboveSheet: function() {
                    var e = n.instance();
                    return e.progressBarHeight.get() + e.sheetWrapperHeight.get()
                },
                modeSelector: function() {
                    var e = n.instance();
                    return e.progressBarHeight.get() + e.sheetWrapperHeight.get() - 59
                },
                insideSheet: function() {
                    var e = n.instance(),
                        t = e.oldSheetWrapperHeight.get() - e.sheetWrapperInnerHeight.get();
                    return e.sheetWrapperHeight.get() - t
                }
            })
        }.call(this),
        function() {
            n.__checkName("FlowSheet"), n.FlowSheet = new n("Template.FlowSheet", function() {
                var e = this;
                return P.If(function() {
                    return x.call(e.lookup("hasNewSheets"))
                }, function() {
                    return ["\n		", P.If(function() {
                        return x.dataMustache(e.lookup("renderModeIs"), "svg")
                    }, function() {
                        return ["\n			", A.IMG(A.Attrs(function() {
                            return x.attrMustache(e.lookup("svgParams"))
                        })), "\n		"]
                    }), "\n		", P.If(function() {
                        return x.dataMustache(e.lookup("renderModeIs"), "png")
                    }, function() {
                        return ["\n			", P.Each(function() {
                            return x.call(e.lookup("newSheets"))
                        }, function() {
                            return ["\n				", A.IMG(A.Attrs(function() {
                                return x.attrMustache(e.lookup("pngParams"))
                            })), "\n			"]
                        }), "\n		"]
                    }), "\n		", x.include(e.lookupTemplate("DymicSheetStyles")), "\n	"]
                }, function() {
                    return ["\n	", A.IMG({
                        style: function() {
                            return ["height: ", x.mustache(x.dot(e.lookup("musicsheets"), "dimensions_normal", "height")), "px; width: ", x.mustache(x.dot(e.lookup("musicsheets"), "dimensions_normal", "width")), "px;"]
                        },
                        src: function() {
                            return P.If(function() {
                                return x.call(e.lookup("isRetina"))
                            }, function() {
                                return P.View("lookup:getCf", function() {
                                    return x.mustache(e.lookup("getCf"), x.dot(e.lookup("musicsheets"), "filename_retina"))
                                })
                            }, function() {
                                return P.View("lookup:getCf", function() {
                                    return x.mustache(e.lookup("getCf"), x.dot(e.lookup("musicsheets"), "filename_normal"))
                                })
                            })
                        }
                    }), "\n	"]
                })
            })
        }.call(this),
        function() {
            var e = new o("png");
            n.FlowSheet.renderDPI = Te = new o(150);
            var t = new o(Te.get() / 300),
                a = 512;
            n.FlowSheet.helpers({
                renderModeIs: function(t) {
                    return e.get() === t
                },
                hasNewSheets: function() {
                    return this.musicsheets_v2 && this.musicsheets_v2.files && this.musicsheets_v2.files.pngSlices && this.musicsheets_v2.files.svg && this.musicsheets_v2.files.svgDimensions && this.syncStatus_v2
                },
                newSheets: function() {
                    var e = r(),
                        t = this.musicsheets_v2.files.pngSlices[e];
                    return t = t || [], i.map(t, function(e, t) {
                        return {
                            value: e,
                            index: t
                        }
                    })
                },
                isRetina: function() {
                    return v.isRetina()
                },
                pngParams: function() {
                    var e = n.parentData(),
                        t = r(),
                        o = this.value.valueOf(),
                        i = e.musicsheets_v2.files.pngDimensions[t].height,
                        s = i / (v.isRetina() ? 2 : 1);
                    return {
                        src: v.loadCf(o),
                        style: "left:" + a * this.index + "px;",
                        height: s + "px",
                        "class": "split-image " + (v.isRetina() ? "retina" : "")
                    }
                },
                svgParams: function() {
                    var e = n.currentData(),
                        o = Math.round(300 * e.musicsheets_v2.pageFormat.width * t.get()),
                        i = Math.round(300 * e.musicsheets_v2.pageFormat.height * t.get());
                    return {
                        style: "width: " + o + "px; height: " + i + "px",
                        src: v.loadCf(e.musicsheets_v2.files.svg),
                        "class": "svg-image"
                    }
                }
            }), n.FlowSheet.onRendered(function() {
                var e = n.currentData(),
                    t = v.player.hasNewSheet(e);
                n.FlowSheet.getSheetWidth = function() {
                    var t = Math.floor(e.musicsheets_v2.pageFormat.width * Te.get());
                    return t
                }
            }), n.FlowSheet.getPngSlice = function(e) {
                if (!v.player.isLoaded.get()) return {};
                var t = D,
                    n = r(),
                    o = D.musicsheets_v2.files.pngSlices[n][e],
                    i = t.musicsheets_v2.files.pngDimensions[n].height,
                    a = i / (v.isRetina() ? 2 : 1);
                return {
                    src: v.loadCf(o),
                    height: a + "px",
                    "class": "split-image " + (v.isRetina() ? "retina" : "")
                }
            }, n.FlowSheet.getAccidentalInfo = function() {
                if (!v.player.isLoaded.get()) return {};
                var e = D.accidentalInfo;
                if (!e) return null;
                var t = e.start * e.spatium * .5,
                    n = e.end * e.spatium * .5,
                    o = e.widthOfFirstNote * e.spatium * .5,
                    i = n - o + 5 - (t - 20) + 30,
                    a = 30;
                return {
                    width: i,
                    imgLeft: -a
                }
            }, n.FlowSheet.currentScale = function() {
                return t.get()
            };
            var r = n.FlowSheet.pngDPI = function() {
                var e = Te.get();
                return v.isRetina() ? 2 * e : e
            }
        }.call(this),
        function() {
            n.__checkName("FlowPlayer"), n.FlowPlayer = new n("Template.FlowPlayer", function() {
                var e = this;
                return [P.If(function() {
                    return x.call(e.lookup("isCordova"))
                }, function() {
                    return ["\n	", x.include(e.lookupTemplate("PlayerIconsCordova")), "\n"]
                }), "\n\n", P.Unless(function() {
                    return x.dataMustache(e.lookup("optionIs"), "hideLoadingScreen")
                }, function() {
                    return ["\n	", P.Unless(function() {
                        return x.dataMustache(e.lookup("settings"), "wait")
                    }, function() {
                        return ["\n		", P.If(function() {
                            return x.call(e.lookup("isLoading"))
                        }, function() {
                            return ["\n		", x.include(e.lookupTemplate("FlowPlayerLoadingScreen")), "\n		"]
                        }), "\n	"]
                    }), "\n"]
                }), A.Raw("\n\n\n<!-- Video -->\n"), x.With(function() {
                    return x.call(e.lookup("song"))
                }, function() {
                    return ["\n", A.VIDEO({
                        id: "flat-video",
                        style: function() {
                            return ["width:", x.mustache(e.lookup("videoWidth")), "px; height:", x.mustache(e.lookup("videoHeight")), "px"]
                        },
                        preload: "auto",
                        "class": "abs bottomAboveSheet"
                    }, "\n	", P.If(function() {
                        return x.call(e.lookup("canPlayHls"))
                    }, function() {
                        return ["\n		", A.SOURCE({
                            type: "video/mp4;",
                            src: function() {
                                return x.mustache(e.lookup("getHls"), e.lookup("videoHls"))
                            }
                        }), "\n	"]
                    }), "\n	", A.SOURCE({
                        type: "video/mp4;",
                        src: function() {
                            return x.mustache(e.lookup("getCf"), e.lookup("videoMp4"))
                        }
                    }), "\n	", A.SOURCE({
                        type: "video/webm;",
                        src: function() {
                            return x.mustache(e.lookup("getCf"), e.lookup("videoWebm"))
                        }
                    }), "\n"), "\n\n\n", P.If(function() {
                        return x.dataMustache(e.lookup("settings"), "light")
                    }, function() {
                        return ["\n	", P._TemplateWith(function() {
                            return {
                                width: x.call(e.lookup("videoWidth")),
                                height: x.call(e.lookup("videoHeight"))
                            }
                        }, function() {
                            return x.include(e.lookupTemplate("piano"))
                        }), "\n"]
                    }), "\n"]
                }), "\n\n\n", P.Unless(function() {
                    return x.dataMustache(e.lookup("settings"), "loopActive")
                }, function() {
                    return ["\n", P.If(function() {
                        return x.dataMustache(e.lookup("state"), "playing", "paused")
                    }, function() {
                        return ["\n	", A.DIV({
                            "class": function() {
                                return ["video-loading-spinner ", P.Unless(function() {
                                    return x.dataMustache(e.lookup("videoLoading"), "video")
                                }, function() {
                                    return "hide"
                                })]
                            }
                        }, "\n		", P._TemplateWith(function() {
                            return x.call(e.lookup("smallSpinner"))
                        }, function() {
                            return x.include(e.lookupTemplate("spinner"))
                        }), "\n	"), "\n"]
                    }), "\n"]
                }), A.Raw("\n\n\n<!-- Header -->\n"), P.If(function() {
                    return x.call(e.lookup("isCordova"))
                }, function() {
                    return ["\n", P._TemplateWith(function() {
                        return {
                            visible: x.call(e.lookup("nativeVolumeBarIsVisible"))
                        }
                    }, function() {
                        return x.include(e.lookupTemplate("NativeVolumeBar"))
                    }), "\n"]
                }), "\n\n", P.If(function() {
                    return x.dataMustache(e.lookup("state"), "paused", "readyToLoop")
                }, function() {
                    return ["\n", A.DIV({
                        "class": function() {
                            return ["player-info-template-wrapper ", P.If(function() {
                                return x.call(e.lookup("nativeVolumeBarIsVisible"))
                            }, function() {
                                return "invisible"
                            })]
                        }
                    }, "\n	", P._TemplateWith(function() {
                        return {
                            template: x.call(e.lookup("playerInfoTemplate")),
                            data: x.call(e.lookup("playerInfoTemplateData"))
                        }
                    }, function() {
                        return x.include(function() {
                            return x.call(n.__dynamic)
                        })
                    }), "\n"), "\n"]
                }), "\n\n\n", x.include(e.lookupTemplate("FlowPlayerHeader")), A.Raw("\n\n<!-- Controls -->\n\n"), x.With(function() {
                    return x.call(e.lookup("song"))
                }, function() {
                    return ["\n", P.If(function() {
                        return x.dataMustache(e.lookup("state"), "paused", "readyToLoop")
                    }, function() {
                        return ["\n", P.Unless(function() {
                            return x.call(e.lookup("isLoading"))
                        }, function() {
                            return ["\n	", x.include(e.lookupTemplate("ModeSelector")), "\n"]
                        }), "\n", A.DIV({
                            id: "flat-control-button-bg",
                            "class": "abs bottomAboveSheet"
                        }), "\n", A.DIV({
                            "class": function() {
                                return ["control-button hand abs icon-position hand-button ", x.mustache(e.lookup("handStatus"), "left"), " bottomAboveSheet"]
                            },
                            id: "left-hand"
                        }, P._TemplateWith(function() {
                            return "hand-left"
                        }, function() {
                            return x.include(e.lookupTemplate("PlayerIcon"))
                        })), "\n", A.DIV({
                            "class": function() {
                                return ["control-button hand abs icon-position hand-button ", x.mustache(e.lookup("handStatus"), "right"), " bottomAboveSheet"]
                            },
                            id: "right-hand"
                        }, P._TemplateWith(function() {
                            return "hand-right"
                        }, function() {
                            return x.include(e.lookupTemplate("PlayerIcon"))
                        })), "\n"]
                    }), "\n\n\n", P.Unless(function() {
                        return x.dataMustache(e.lookup("state"), "paused", "readyToLoop")
                    }, function() {
                        return ["\n	", P.If(function() {
                            return x.dataMustache(e.lookup("settings"), "wait")
                        }, function() {
                            return ["\n		", A.DIV({
                                id: "wait-feedback-circle",
                                "class": function() {
                                    return ["control-button abs bottomAboveSheet ", x.mustache(e.lookup("playedRightCircle"))]
                                }
                            }), "\n	"]
                        }), "\n"]
                    }), "\n\n", A.DIV({
                        "class": function() {
                            return ["control-button icon-position ", x.mustache(e.lookup("playButtonClass")), " bottomAboveSheet hand abs"]
                        },
                        id: "flow-play"
                    }, P._TemplateWith(function() {
                        return x.call(e.lookup("playButtonClass"))
                    }, function() {
                        return x.include(e.lookupTemplate("PlayerIcon"))
                    })), "\n\n\n", A.Comment(" Sheet "), "\n", A.DIV({
                        id: "flat-noten-bg",
                        "class": "abs sheetHeight"
                    }, "\n	", P.If(function() {
                        return x.call(e.lookup("hasAccidental"))
                    }, function() {
                        return ["\n	", A.DIV({
                            "class": function() {
                                return ["accidental abs sheetHeight accelerate3d ", x.mustache(e.lookup("showAccidental"))]
                            },
                            style: function() {
                                return x.mustache(e.lookup("accidentalStyle"));

                            }
                        }, A.IMG(A.Attrs(function() {
                            return x.attrMustache(e.lookup("accidentalSliceParams"))
                        }))), "\n	"]
                    }), "\n	", A.DIV({
                        id: "sheet-wrapper"
                    }, "\n		", A.DIV({
                        id: "secondPositionMarker",
                        "class": function() {
                            return ["abs hand ", P.Unless(function() {
                                return x.call(e.lookup("getLoopStatus"))
                            }, function() {
                                return "hide"
                            })]
                        }
                    }), "\n		", A.DIV({
                        id: "sheet",
                        "class": "abs accelerate3d"
                    }, "\n			", A.DIV({
                        id: "loop_marker"
                    }), "\n			", x.include(e.lookupTemplate("FlowSheet")), "\n		"), "\n	"), "\n\n	", P.If(function() {
                        return x.call(e.lookup("hasLoopSelection"))
                    }, function() {
                        return ["\n		", P.If(function() {
                            return x.dataMustache(e.lookup("state"), "paused")
                        }, function() {
                            return ["\n		", A.DIV({
                                id: "open-selector",
                                "class": function() {
                                    return ["hand ", P.If(function() {
                                        return x.call(e.lookup("getLoopStatus"))
                                    }, function() {
                                        return "hide"
                                    })]
                                }
                            }, "\n			", A.DIV({
                                "class": "icon-position loop-small open-icon"
                            }, P._TemplateWith(function() {
                                return "loop"
                            }, function() {
                                return x.include(e.lookupTemplate("PlayerIcon"))
                            })), "\n		"), "\n		"]
                        }), "\n	"]
                    }), "\n\n	", A.DIV({
                        id: "selectorElement",
                        "class": function() {
                            return ["abs accelerate3d ", x.mustache(e.lookup("getLoopStatus")), " ", P.If(function() {
                                return x.dataMustache(e.lookup("state"), "playing", "waiting")
                            }, function() {
                                return "playing"
                            }), " "]
                        }
                    }, "\n		", P.If(function() {
                        return x.dataMustache(e.lookup("state"), "readyToLoop")
                    }, function() {
                        return ["\n			", A.DIV({
                            id: "loopButton",
                            "class": "icon-position"
                        }, P._TemplateWith(function() {
                            return "cross"
                        }, function() {
                            return x.include(e.lookupTemplate("PlayerIcon"))
                        })), "\n		"]
                    }), "\n	"), "\n"), "\n\n", P.If(function() {
                        return x.dataMustache(e.lookup("state"), "paused", "readyToLoop")
                    }, function() {
                        return ["\n", A.DIV({
                            id: "back-to-start",
                            "class": "hand sheetHeight"
                        }, "\n	", A.DIV({
                            "class": "inner"
                        }, "\n    	", A.DIV({
                            id: "back-button",
                            "class": "icon-position back_to_start"
                        }, P._TemplateWith(function() {
                            return "rewind"
                        }, function() {
                            return x.include(e.lookupTemplate("PlayerIcon"))
                        })), "\n	"), "\n"), "\n"]
                    }), "\n\n", A.Comment(" Timeline "), "\n", A.DIV({
                        id: "flat-timebar",
                        "class": "timeBar abs accelerate3d"
                    }, "\n	", A.DIV({
                        id: "flat-progressBar",
                        "class": "progressBar"
                    }), "\n	", A.DIV({
                        id: "flat-progress-bg"
                    }), "\n	", A.DIV({
                        id: "flat-timeCircle",
                        "class": function() {
                            return ["timeCircle hand abs accelerate3d ", P.Unless(function() {
                                return x.dataMustache(e.lookup("state"), "paused", "readyToLoop")
                            }, function() {
                                return "hide"
                            })]
                        }
                    }), "\n"), "\n"]
                }), "\n\n", P.Unless(function() {
                    return x.dataMustache(e.lookup("optionIs"), "hideMicScreen")
                }, function() {
                    return ["\n	", P.If(function() {
                        return x.call(e.lookup("micIsLoading"))
                    }, function() {
                        return ["\n	", x.include(e.lookupTemplate("flow_setup")), "\n	"]
                    }), "\n"]
                })]
            })
        }.call(this),
        function() {
            function t(e) {
                function t(e) {
                    var t = z.get("hand");
                    if (t === e) return "none";
                    if ("none" === t) return e;
                    if ("left" === e) {
                        if ("both" === t) return "right";
                        if ("right" === t) return "both"
                    } else {
                        if ("right" !== e) return "error";
                        if ("both" === t) return "left";
                        if ("left" === t) return "both"
                    }
                }
                z.set({
                    hand: t(e)
                })
            }
            n.FlowPlayer.onCreated(function() {
                this.delayedMicLoading = new o(!1)
            }), n.FlowPlayer.onRendered(function() {
                var t = $("body");
                t.addClass("flow-player"), z.get("isMobile") && t.addClass("mobile"), e.isCordova && t.addClass("cordova");
                var o = n.currentData() || {},
                    i = o.song || {},
                    a = o.options || {};
                V.load(i, a)
            }), n.FlowPlayer.onDestroyed(function() {
                $("body").removeClass("flow-player mobile"), $(window).off("unload.playerState"), V.unload()
            }), n.FlowPlayer.stateIsActive = function() {
                var e = Array.prototype.slice.call(arguments);
                return V.isLoaded.get() ? i.any(e, function(e) {
                    return C.current === e
                }) : !0
            }, n.FlowPlayer.helpers({
                isCordova: function() {
                    return e.isCordova
                },
                accidentalSliceParams: function() {
                    var e = n.FlowSheet.getPngSlice(0),
                        t = n.FlowSheet.getAccidentalInfo();
                    return t && (e.style = "left: " + t.imgLeft + "px"), e
                },
                hasAccidental: function() {
                    return V.isLoaded.get() && D.accidentalDisabled !== !0 && D.accidentalInfo
                },
                showAccidental: function() {
                    return we.isLoaded.get() ? we.showAccidental.get() ? "show-accidental" : "hide-accidental" : void 0
                },
                accidentalStyle: function() {
                    var e = n.FlowSheet.getAccidentalInfo();
                    return e ? "width:" + e.width + "px" : void 0
                },
                playerInfoTemplate: function() {
                    var e = n.currentData();
                    return v.findIn(e, "options.playerInfo.template") || "SongInfo"
                },
                smallSpinner: function() {
                    return {
                        lines: 13,
                        length: 4,
                        width: 2,
                        radius: 6,
                        color: "#fff",
                        shadow: !1,
                        hwaccel: !0,
                        className: "spinner small-white"
                    }
                },
                playerInfoTemplateData: function() {
                    var e = n.currentData();
                    return v.findIn(e, "options.playerInfo.data") || {
                        title: e.song.title,
                        subtitle: e.song.artist,
                        arrangement: e.song.arrangement
                    }
                },
                getLoopStatus: function() {
                    return z.get("loopActive") && z.get("loopSelection") && "loop-active"
                },
                handStatus: function(e) {
                    var t = z.get("hand");
                    return t === e || "both" === t ? "orange" : "grey"
                },
                hasLoopSelection: function() {
                    return z.get("loopSelection") === !0
                },
                componentIsLoading: function(e) {
                    return !V[e].isLoaded.get()
                },
                isLoading: function() {
                    return !V.isLoaded.get()
                },
                micIsLoading: function() {
                    var e = n.instance(),
                        t = "loading" === v.audioManager.inputStatus.get(),
                        o = "audio" === v.inputManager.inputType.get(),
                        i = e.delayedMicLoading.get();
                    return o && t && (i || r.afterFlush(function() {
                        setTimeout(function() {
                            e.delayedMicLoading.set(!0)
                        }, 70)
                    })), i && o && t
                },
                videoLoading: function() {
                    return be.isLoading.get()
                },
                playButtonClass: function() {
                    return V.isLoaded.get() && C.can("pause") ? "pause" : "play"
                },
                playedRightCircle: function() {
                    return fe.get() && "green"
                },
                state: n.FlowPlayer.stateIsActive,
                optionIs: function(e) {
                    return !!this.options[e]
                },
                videoWidth: function() {
                    return v.player.width.get()
                },
                videoHeight: function() {
                    var e = 650 / 1920;
                    return e * v.player.width.get()
                },
                canPlayHls: function() {
                    var e = n.currentData().videoHls;
                    return be.supportsNativeHls && e
                },
                getHls: function(e) {
                    return "//d22ldt2gt3m2rx.cloudfront.net/" + e
                }
            }), n.FlowPlayer.events({
                "click #back-to-start": function(e, t) {
                    V.lastUpdatedBy = "back-to-start", e.currentTarget.classList.remove("hover"), we.transitionToPx(0, 700)
                },
                "click #open-selector": function(e, t) {
                    C.is("paused") && C.openLoop()
                },
                "click .control-button": function(e) {
                    var n = $(e.currentTarget);
                    switch (n.attr("id")) {
                        case "flow-play":
                            C.can("pause") ? C.pause() : C.can("play") && C.play();
                            break;
                        case "left-hand":
                            return t("left");
                        case "right-hand":
                            return t("right")
                    }
                }
            })
        }.call(this), "undefined" == typeof Package && (Package = {}), Package["flow-player"] = {
            flow: v
        }
}();

