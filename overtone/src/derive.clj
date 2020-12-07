(ns derive.intro
  (:require
   [clj-http.client :as http])
  [clojure.string :as string])


;; (:use [clojure.core])
   ;; [overtone.live]

;; (demo (sin-osc))
;; (:body (http/get "http://0.0.0.0:8888/similar/vector?x=0&y=0&z=0&results=1"))
;; (:body (http/get "http://0.0.0.0:8888/coordinates"))
;; (:body (http/get "http://0.0.0.0:8888/similar/vector?x=0&y=0&z=0&results=1"))


(clojure.core/nth (get-in (http/get "http://0.0.0.0:8888/similar/vector?x=0&y=0&z=0&results=1" {:accept :json}) [:body]) 0)
;; (parse-string (get-in (http/get "http://0.0.0.0:8888/similar/vector?x=0&y=0&z=0&results=1" {:accept :json}) [:body]))

(defn square [x]
  (* x x))

(def my-map
  {:a-key     1
   :other-key 2})

(def scores {"Fred"   1400
             "Bob"    1240
             "Angela" 1024})

(defn generate-filename
  [sample]
  (join "/" [1 2 ".." sample]))
