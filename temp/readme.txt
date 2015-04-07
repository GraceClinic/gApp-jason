The temp/ folder is set aside for transient application data. This information would not typically be committed to the
applications VCS repository. If data under the temp/ directory were deleted, the application should be able to continue
running with a possible decrease in performance until data is once again restored or recached.