(defproject derive-live "1.0.0"
  :dependencies [[overtone/overtone "0.10.6"] [clj-http "3.10.1"] [cheshire "5.8.1"]]
  :native-path "native"
  :source-paths ["src"]
  :sc-args {:max-buffers 4096})
