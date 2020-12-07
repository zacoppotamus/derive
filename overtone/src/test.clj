(ns derive.testing
  (:use
   [overtone.sc synth envelope ugens]
        [overtone.music pitch]
        ))

(defn -main
  "I don't do a whole lot ... yet."
  [& args]
  (println "I'm a little teapot!"))

(defn train
  []
  (println "Choo Choo!"))

(train)
(.toUpperCase "boqzhidar")

(defn toUpper
  [a]
  (.toUpperCase a))

(defn fact-rec [n]
  (if (= n 1)
    1
    (* n (fact-rec (dec n)))))

(fact-rec 10)
;; (demo (sin-osc))

;; (defsynth granular [out 0, buf 0, pan 0, start 0, amp 0.8, dur 0.25]
;;   (let [grain (play-buf 1 buf (buf-rate-scale:kr buf) 1
;;                         (* start (buf-frames:ir buf)) 0)
;;         env (- (env-gen:ar (perc 0.01 dur) 1 1 0 1 FREE) 0.001)]
;;     (out out (* (pan2 (* grain env) pan) amp))))
