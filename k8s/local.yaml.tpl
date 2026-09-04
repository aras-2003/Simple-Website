apiVersion: v1
kind: Namespace
metadata:
  name: {{NAMESPACE}}
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: personal-site
  namespace: {{NAMESPACE}}
  labels:
    app.kubernetes.io/name: personal-site
spec:
  replicas: 1
  revisionHistoryLimit: 2
  selector:
    matchLabels:
      app.kubernetes.io/name: personal-site
  template:
    metadata:
      labels:
        app.kubernetes.io/name: personal-site
    spec:
      automountServiceAccountToken: false
      securityContext:
        seccompProfile:
          type: RuntimeDefault
      containers:
        - name: web
          image: {{IMAGE}}
          imagePullPolicy: Never
          ports:
            - name: http
              containerPort: 8080
          readinessProbe:
            httpGet:
              path: /healthz
              port: http
            initialDelaySeconds: 2
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /healthz
              port: http
            initialDelaySeconds: 5
            periodSeconds: 15
          resources:
            requests:
              cpu: 10m
              memory: 16Mi
            limits:
              cpu: 200m
              memory: 96Mi
          volumeMounts:
            - name: tmp
              mountPath: /tmp
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            runAsNonRoot: true
            capabilities:
              drop: ["ALL"]
      volumes:
        - name: tmp
          emptyDir:
            sizeLimit: 16Mi
---
apiVersion: v1
kind: Service
metadata:
  name: personal-site
  namespace: {{NAMESPACE}}
spec:
  selector:
    app.kubernetes.io/name: personal-site
  ports:
    - name: http
      port: 80
      targetPort: http
  type: ClusterIP
